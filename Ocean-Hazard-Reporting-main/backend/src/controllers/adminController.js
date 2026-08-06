const { HazardReport, User, AIAnalysis } = require('../models');
const { refreshProfileCounters } = require('../services/profileService');

const getAllReports = async (req, res, next) => {
  try {
    const reports = await HazardReport.findAll({ include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }, { model: AIAnalysis, as: 'aiAnalysis' }], order: [['created_at', 'DESC']] });
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
    const authorities = await User.findAll({
      where: { role: 'Authority', approval_status: 'Pending' },
      attributes: [
        'id', 'name', 'email', ['department_name', 'department'],
        ['organization_name', 'organization'], 'government_authority_id',
        ['created_at', 'registration_date'], ['approval_status', 'status'],
      ],
      order: [['created_at', 'ASC']],
    });
    res.json({ count: authorities.length, authorities });
  } catch (error) { next(error); }
};

const updateAuthorityApprovalStatus = (approval_status, message) => async (req, res, next) => {
  try {
    const authority = await User.findOne({ where: { id: req.params.id, role: 'Authority', approval_status: 'Pending' } });
    if (!authority) return res.status(404).json({ message: 'Pending authority application not found.' });
    await authority.update({ approval_status });
    res.json({ message, authority: { id: authority.id, name: authority.name, email: authority.email, approval_status: authority.approval_status } });
  } catch (error) { next(error); }
};

module.exports = {
  getAllReports,
  verifyReport: changeStatus('Verified'),
  rejectReport: changeStatus('Rejected'),
  getPendingAuthorities,
  approveAuthority: updateAuthorityApprovalStatus('Approved', 'Authority account approved.'),
  rejectAuthority: updateAuthorityApprovalStatus('Rejected', 'Authority account rejected.'),
};