const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIAnalysis = sequelize.define('AIAnalysis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  hazard_prediction: { type: DataTypes.ENUM('Oil Spill', 'Plastic Pollution', 'Cyclone Damage', 'High Waves', 'Marine Animal Death', 'Coastal Flooding', 'Ship Accident', 'Other'), allowNull: false },
  confidence_score: { type: DataTypes.DECIMAL(5, 2), allowNull: false, validate: { min: 0, max: 100 } },
  risk_level: { type: DataTypes.ENUM('Low', 'Medium', 'High'), allowNull: false },
  explanation: { type: DataTypes.TEXT, allowNull: false },
  recommendation: { type: DataTypes.STRING(500), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'ai_analyses', timestamps: false });

module.exports = AIAnalysis;
