const { HazardReport, Alert, User, UserProfile, AIAnalysis } = require('../models');

const getStatistics = async (req, res, next) => {
  try {
    if (req.user.role === 'Citizen') {
      const [profile, latestReports, totalReports, verifiedReports, pendingReports] = await Promise.all([
        UserProfile.findOne({ where: { user_id: req.user.id } }),
        HazardReport.findAll({ where: { user_id: req.user.id }, include: [{ model: AIAnalysis, as: 'aiAnalysis' }], order: [['created_at', 'DESC']], limit: 5 }),
        HazardReport.count({ where: { user_id: req.user.id } }),
        HazardReport.count({ where: { user_id: req.user.id, status: 'Verified' } }),
        HazardReport.count({ where: { user_id: req.user.id, status: 'Pending' } }),
      ]);
      return res.json({ role: 'Citizen', profile, statistics: { totalReports, verifiedReports, pendingReports }, latestReports });
    }
    if (req.user.role === 'Authority') {
      const [reportsAssigned, reportsVerified, activeAlerts] = await Promise.all([
        HazardReport.count({ where: { assigned_authority_id: req.user.id } }),
        HazardReport.count({ where: { verified_by: req.user.id, status: 'Verified' } }), Alert.count(),
      ]);
      return res.json({ role: 'Authority', statistics: { reportsAssigned, reportsVerified, activeAlerts } });
    }
    const [totalUsers, totalCitizens, totalAuthorities, pendingAuthorityApprovals, totalReports, pendingReports, verifiedReports, activeAlerts] = await Promise.all([
      User.count(), User.count({ where: { role: 'Citizen' } }), User.count({ where: { role: 'Authority' } }),
      User.count({ where: { role: 'Authority', approval_status: 'Pending' } }), HazardReport.count(),
      HazardReport.count({ where: { status: 'Pending' } }), HazardReport.count({ where: { status: 'Verified' } }), Alert.count(),
    ]);
    return res.json({ role: 'Admin', statistics: { totalUsers, totalCitizens, totalAuthorities, pendingAuthorityApprovals, totalReports, pendingReports, verifiedReports, activeAlerts } });
  } catch (error) { next(error); }
};

module.exports = { getStatistics };
