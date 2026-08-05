const User = require('./User');
const HazardReport = require('./HazardReport');
const Alert = require('./Alert');
const SocialMediaAnalytics = require('./SocialMediaAnalytics');
const UserProfile = require('./UserProfile');

User.hasMany(HazardReport, { foreignKey: 'user_id', as: 'reports', onDelete: 'CASCADE' });
HazardReport.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
HazardReport.hasMany(Alert, { foreignKey: 'report_id', as: 'alerts', onDelete: 'CASCADE' });
Alert.belongsTo(HazardReport, { foreignKey: 'report_id', as: 'report' });
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(HazardReport, { foreignKey: 'assigned_authority_id', as: 'assigned_reports' });
HazardReport.belongsTo(User, { foreignKey: 'assigned_authority_id', as: 'assigned_authority' });
User.hasMany(HazardReport, { foreignKey: 'verified_by', as: 'verified_reports' });
HazardReport.belongsTo(User, { foreignKey: 'verified_by', as: 'verifier' });

module.exports = { User, HazardReport, Alert, SocialMediaAnalytics, UserProfile };
