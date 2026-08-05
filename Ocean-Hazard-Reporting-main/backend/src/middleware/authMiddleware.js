const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication token is required.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission for this action.' });
  }
  next();
};

const requireApprovedAuthority = (req, res, next) => {
  if (req.user.role === 'Authority' && req.user.approval_status !== 'Approved') {
    return res.status(403).json({ message: 'Your authority account is awaiting administrator approval.' });
  }
  next();
};

module.exports = { authenticate, authorize, requireApprovedAuthority };
