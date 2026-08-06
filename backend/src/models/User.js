const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('Citizen', 'Authority', 'Admin'), allowNull: false, defaultValue: 'Citizen' },
  approval_status: { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), allowNull: false, defaultValue: 'Approved' },
  government_authority_id: { type: DataTypes.STRING(100), allowNull: true },
  department_name: { type: DataTypes.STRING(150), allowNull: true },
  organization_name: { type: DataTypes.STRING(150), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'users', timestamps: false });
module.exports = User;