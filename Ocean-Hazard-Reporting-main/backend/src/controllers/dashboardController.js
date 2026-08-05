const { HazardReport, Alert, User, UserProfile } = require('../models');

const getStatistics = async (req, res, next) => {
  try {
    if (req.user.role === 'Citizen') {
      const [profile, latestReports] = await Promise.all([
        UserProfile.findOne({ where: { user_id: req.user.id } }),
        HazardReport.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']], limit: 5 }),
      ]);
      return res.json({ role: 'Citizen', profile, statistics: { totalReports: profile?.reports_submitted || 0, verifiedReports: profile?.verified_reports || 0, pendingReports: profile?.pending_reports || 0 }, latestReports });
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
