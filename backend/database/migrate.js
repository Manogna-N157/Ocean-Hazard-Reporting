/* Run manually with: npm run migrate. The server also runs this safely on startup. */
require('dotenv').config();
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const { UserProfile, AIAnalysis, SocialMediaAnalysis } = require('../src/models');

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

const runMigrations = async () => {
  await addColumnIfMissing('users', 'approval_status', { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), allowNull: false, defaultValue: 'Approved' });
  await sequelize.getQueryInterface().changeColumn('users', 'approval_status', { type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'), allowNull: false, defaultValue: 'Approved' });
  await addColumnIfMissing('users', 'government_authority_id', { type: DataTypes.STRING(100), allowNull: true });
  await addColumnIfMissing('users', 'department_name', { type: DataTypes.STRING(150), allowNull: true });
  await addColumnIfMissing('users', 'organization_name', { type: DataTypes.STRING(150), allowNull: true });
  await addColumnIfMissing('hazard_reports', 'assigned_authority_id', { type: DataTypes.INTEGER, allowNull: true });
  await addColumnIfMissing('hazard_reports', 'verified_by', { type: DataTypes.INTEGER, allowNull: true });
  await addForeignKeyIfMissing('hazard_reports', 'assigned_authority_id', 'fk_report_assigned_authority', 'SET NULL');
  await addForeignKeyIfMissing('hazard_reports', 'verified_by', 'fk_report_verifier', 'SET NULL');
  await UserProfile.sync();
  await AIAnalysis.sync();
  await SocialMediaAnalysis.sync();
  await addColumnIfMissing('social_media_analyses', 'original_url', { type: DataTypes.STRING(2048), allowNull: true });
  await addColumnIfMissing('social_media_analyses', 'extracted_text', { type: DataTypes.TEXT, allowNull: true });
  await sequelize.getQueryInterface().changeColumn('social_media_analyses', 'input_type', { type: DataTypes.ENUM('Text', 'Image', 'URL'), allowNull: false });
  await addColumnIfMissing('ai_analyses', 'explanation', { type: DataTypes.TEXT, allowNull: false, defaultValue: '' });
  await sequelize.query(`INSERT INTO user_profiles (user_id, name, email, role, date_joined, reports_submitted, verified_reports, pending_reports)
    SELECT u.id, u.name, u.email, u.role, u.created_at,
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id),
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id AND r.status = 'Verified'),
      (SELECT COUNT(*) FROM hazard_reports r WHERE r.user_id = u.id AND r.status = 'Pending')
    FROM users u
    ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), role = VALUES(role),
      reports_submitted = VALUES(reports_submitted), verified_reports = VALUES(verified_reports), pending_reports = VALUES(pending_reports)`);
  console.log('Database migration completed.');
};

if (require.main === module) {
  sequelize.authenticate()
    .then(runMigrations)
    .then(() => sequelize.close())
    .catch(async (error) => { console.error('Migration failed:', error); await sequelize.close(); process.exit(1); });
}

module.exports = { runMigrations };
