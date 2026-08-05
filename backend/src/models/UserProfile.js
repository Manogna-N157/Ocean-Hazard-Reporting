const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserProfile = sequelize.define('UserProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  role: { type: DataTypes.ENUM('Citizen', 'Authority', 'Admin'), allowNull: false },
  date_joined: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  reports_submitted: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  verified_reports: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  pending_reports: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, { tableName: 'user_profiles', timestamps: false });

module.exports = UserProfile;
