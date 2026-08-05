const { HazardReport, UserProfile } = require('../models');

const refreshProfileCounters = async (userId, transaction) => {
  const [reports_submitted, verified_reports, pending_reports] = await Promise.all([
    HazardReport.count({ where: { user_id: userId }, transaction }),
    HazardReport.count({ where: { user_id: userId, status: 'Verified' }, transaction }),
    HazardReport.count({ where: { user_id: userId, status: 'Pending' }, transaction }),
  ]);
  return UserProfile.update({ reports_submitted, verified_reports, pending_reports }, { where: { user_id: userId }, transaction });
};

module.exports = { refreshProfileCounters };
