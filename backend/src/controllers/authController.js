const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { User, UserProfile } = require('../models');
const { createToken } = require('../services/tokenService');

const register = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'Email is already registered.' });
    const transaction = await sequelize.transaction();
    let user;
    try {
      user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password, 10), role: 'Citizen', approval_status: 'Approved' }, { transaction });
      await UserProfile.create({ user_id: user.id, name: user.name, email: user.email, role: user.role, date_joined: user.created_at }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return res.status(201).json({ message: 'User registered successfully.', token: createToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
};

const applyForAuthority = async (req, res, next) => {
  try {
    const { name, password, government_authority_id, department_name, organization_name } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    if (!name || !email || !password || !government_authority_id || !department_name || !organization_name) {
      return res.status(400).json({ message: 'Name, official email, password, government authority ID, department name and organization name are required.' });
    }
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (await User.findOne({ where: { email } })) return res.status(409).json({ message: 'Email is already registered.' });
    const transaction = await sequelize.transaction();
    try {
      const user = await User.create({ name: name.trim(), email, password: await bcrypt.hash(password, 10), role: 'Authority', approval_status: 'Pending', government_authority_id: government_authority_id.trim(), department_name: department_name.trim(), organization_name: organization_name.trim() }, { transaction });
      await UserProfile.create({ user_id: user.id, name: user.name, email: user.email, role: user.role, date_joined: user.created_at }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return res.status(201).json({ message: 'Authority application submitted and is awaiting administrator approval.' });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const password = req.body.password;
    const email = req.body.email?.trim().toLowerCase();
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
    if (user.role === 'Authority' && user.approval_status === 'Pending') {
      return res.status(403).json({ message: 'Your authority account is awaiting administrator approval.' });
    }
    if (user.role === 'Authority' && user.approval_status === 'Rejected') {
      return res.status(403).json({ message: 'Your authority account has been rejected.' });
    }
    const profile = await UserProfile.findOne({ where: { user_id: user.id } });
    return res.json({ message: 'Login successful.', token: createToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role, approval_status: user.approval_status }, profile });
  } catch (error) { next(error); }
};

module.exports = { register, applyForAuthority, login };
