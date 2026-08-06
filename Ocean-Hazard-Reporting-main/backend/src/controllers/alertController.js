const { Alert, HazardReport } = require('../models');

const createAlert = async (req, res, next) => {
  try {
    const { report_id, title, message, location, severity } = req.body;
    if (!report_id || !title || !message || !location || !severity) return res.status(400).json({ message: 'report_id, title, message, location and severity are required.' });
    if (!await HazardReport.findByPk(report_id)) return res.status(404).json({ message: 'Related report not found.' });
    const alert = await Alert.create({ report_id, title, message, location, severity });
    res.status(201).json({ message: 'Alert created.', alert });
  } catch (error) { next(error); }
};

const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.findAll({ include: [{ model: HazardReport, as: 'report', attributes: ['id', 'hazard_type', 'status'] }], order: [['created_at', 'DESC']] });
    res.json({ count: alerts.length, alerts });
  } catch (error) { next(error); }
};

module.exports = { createAlert, getAlerts };
