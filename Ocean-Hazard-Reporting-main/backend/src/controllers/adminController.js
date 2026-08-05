const { HazardReport, User } = require('../models');
const { refreshProfileCounters } = require('../services/profileService');

const getAllReports = async (req, res, next) => {
  try {
    const reports = await HazardReport.findAll({ include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }], order: [['created_at', 'DESC']] });
    res.json({ count: reports.length, reports });
  } catch (error) { next(error); }
};

const changeStatus = (status) => async (req, res, next) => {
  try {
    const report = await HazardReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    await report.update({ status, assigned_authority_id: req.user.role === 'Authority' ? req.user.id : report.assigned_authority_id, verified_by: status === 'Verified' ? req.user.id : null });
    await refreshProfileCounters(report.user_id);
    res.json({ message: `Report ${status.toLowerCase()}.`, report });
  } catch (error) { next(error); }
};

const getPendingAuthorities = async (req, res, next) => {
  try {
    const authorities = await User.findAll({ where: { role: 'Authority', approval_status: 'Pending' }, attributes: { exclude: ['password'] }, order: [['created_at', 'ASC']] });
    res.json({ count: authorities.length, authorities });
  } catch (error) { next(error); }
};

const approveAuthority = async (req, res, next) => {
  try {
    const authority = await User.findOne({ where: { id: req.params.id, role: 'Authority' } });
    if (!authority) return res.status(404).json({ message: 'Authority account not found.' });
    await authority.update({ approval_status: 'Approved' });
    res.json({ message: 'Authority account approved.', authority: { id: authority.id, name: authority.name, email: authority.email, approval_status: authority.approval_status } });
  } catch (error) { next(error); }
};

module.exports = { getAllReports, verifyReport: changeStatus('Verified'), rejectReport: changeStatus('Rejected'), getPendingAuthorities, approveAuthority };
