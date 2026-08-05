const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialMediaAnalytics = sequelize.define('SocialMediaAnalytics', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  keyword: { type: DataTypes.STRING(100), allowNull: false },
  mentions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  sentiment: { type: DataTypes.ENUM('Positive', 'Neutral', 'Negative'), allowNull: false },
  location: { type: DataTypes.STRING(255), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'social_media_analytics', timestamps: false });

module.exports = SocialMediaAnalytics;
