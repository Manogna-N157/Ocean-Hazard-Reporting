/* Run once with: npm run migrate */
require('dotenv').config();
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const { UserProfile } = require('../src/models');

const addColumnIfMissing = async (table, column, definition) => {
  const columns = await sequelize.getQueryInterface().describeTable(table);
  if (!columns[column]) await sequelize.getQueryInterface().addColumn(table, column, definition);
};

const addForeignKeyIfMissing = async (table, column, name, onDelete) => {
  const queryInterface = sequelize.getQueryInterface();
  const foreignKeys = await queryInterface.getForeignKeyReferencesForTable(table);
  if (!foreignKeys.some((key) => key.columnName === column)) {
    await queryInterface.addConstraint(table, { fields: [column], type: 'foreign key', name, references: { table: 'users', field: 'id' }, onDelete });
  }
};

const migrate = async () => {
  await sequelize.authenticate();
  await addColumnIfMissing('users', 'approval_status', { type: DataTypes.ENUM('Approved', 'Pending'), allowNull: false, defaultValue: 'Approved' });
  await addColumnIfMissing('users', 'government_authority_id', { type: DataTypes.STRING(100), allowNull: true });
  await addColumnIfMissing('users', 'department_name', { type: DataTypes.STRING(150), allowNull: true });
  await addColumnIfMissing('users', 'organization_name', { type: DataTypes.STRING(150), allowNull: true });
  await addColumnIfMissing('hazard_reports', 'assigned_authority_id', { type: DataTypes.INTEGER, allowNull: true });
  await addColumnIfMissing('hazard_reports', 'verified_by', { type: DataTypes.INTEGER, allowNull: true });
  await addForeignKeyIfMissing('hazard_reports', 'assigned_authority_id', 'fk_report_assigned_authority', 'SET NULL');
  await addForeignKeyIfMissing('hazard_reports', 'verified_by', 'fk_report_verifier', 'SET NULL');
  await UserProfile.sync();
  await sequelize.query(`INSERT INTO user_profiles (user_id, name, email, role, date_joined, reports_submitted, verified_reports, pending_reports)
    SELECT u.id, u.name, u.email, u.role, u.created_at,
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id),
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id AND r.status = 'Verified'),
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id AND r.status = 'Pending')
    FROM users u
    ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), role = VALUES(role),
      reports_submitted = VALUES(reports_submitted), verified_reports = VALUES(verified_reports), pending_reports = VALUES(pending_reports)`);
  console.log('Database migration completed.');
  await sequelize.close();
};

migrate().catch(async (error) => { console.error('Migration failed:', error); await sequelize.close(); process.exit(1); });
