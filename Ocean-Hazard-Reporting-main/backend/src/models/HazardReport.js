const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HazardReport = sequelize.define('HazardReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  assigned_authority_id: { type: DataTypes.INTEGER, allowNull: true },
  verified_by: { type: DataTypes.INTEGER, allowNull: true },
  hazard_type: { type: DataTypes.ENUM('Oil Spill', 'Cyclone', 'High Waves', 'Plastic Pollution', 'Marine Animal Death', 'Other'), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: true },
  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false, validate: { min: -90, max: 90 } },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false, validate: { min: -180, max: 180 } },
  location: { type: DataTypes.STRING(255), allowNull: false },
  severity: { type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'), allowNull: false, defaultValue: 'Medium' },
  status: { type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'), allowNull: false, defaultValue: 'Pending' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'hazard_reports', timestamps: false });

module.exports = HazardReport;
