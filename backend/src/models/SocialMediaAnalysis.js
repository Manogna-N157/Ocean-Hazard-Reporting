const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialMediaAnalysis = sequelize.define('SocialMediaAnalysis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.ENUM('Authority', 'Admin'), allowNull: false },
  input_type: { type: DataTypes.ENUM('Text', 'Image', 'URL'), allowNull: false },
  original_text: { type: DataTypes.TEXT, allowNull: true },
  original_url: { type: DataTypes.STRING(2048), allowNull: true },
  extracted_text: { type: DataTypes.TEXT, allowNull: true },
  uploaded_image_path: { type: DataTypes.STRING(255), allowNull: true },
  detected_hazard: { type: DataTypes.STRING(100), allowNull: false },
  summary: { type: DataTypes.TEXT, allowNull: false },
  confidence_score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  risk_level: { type: DataTypes.ENUM('Low', 'Medium', 'High'), allowNull: false },
  recommendation: { type: DataTypes.STRING(500), allowNull: false },
  should_investigate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'social_media_analyses', timestamps: false });

module.exports = SocialMediaAnalysis;
