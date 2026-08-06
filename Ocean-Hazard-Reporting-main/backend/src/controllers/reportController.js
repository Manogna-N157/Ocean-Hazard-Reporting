const { HazardReport, User, AIAnalysis } = require('../models');
const { refreshProfileCounters } = require('../services/profileService');

const reportFields = ['hazard_type', 'description', 'latitude', 'longitude', 'location', 'severity'];
const imagePath = (file) => file ? `/uploads/${file.filename}` : undefined;
const canManage = (user, report) => user.role === 'Admin' || user.role === 'Authority' || report.user_id === user.id;

const createReport = async (req, res, next) => {
  try {
    const missing = reportFields.filter((field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === '');
    if (missing.length) return res.status(400).json({ message: `Required fields: ${missing.join(', ')}` });
    const report = await HazardReport.create({ ...req.body, user_id: req.user.id, image_url: imagePath(req.file), status: 'Pending' });
    await refreshProfileCounters(req.user.id);
    return res.status(201).json({ message: 'Hazard report created.', report });
  } catch (error) { next(error); }
};

const getReports = async (req, res, next) => {
  try {
    const where = req.user.role === 'Citizen' ? { user_id: req.user.id } : {};
    const reports = await HazardReport.findAll({ where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }, { model: AIAnalysis, as: 'aiAnalysis' }], order: [['created_at', 'DESC']] });
    res.json({ count: reports.length, reports });
  } catch (error) { next(error); }
};

const getReport = async (req, res, next) => {
  try {
    const report = await HazardReport.findByPk(req.params.id, { include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }, { model: AIAnalysis, as: 'aiAnalysis' }] });
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (req.user.role === 'Citizen' && report.user_id !== req.user.id) return res.status(403).json({ message: 'You can view only your own reports.' });
    res.json({ report });
  } catch (error) { next(error); }
};

const updateReport = async (req, res, next) => {
  try {
    const report = await HazardReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (!canManage(req.user, report)) return res.status(403).json({ message: 'You can update only your own report.' });
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => reportFields.includes(key)));
    if (req.file) updates.image_url = imagePath(req.file);
    if (req.user.role === 'Citizen') delete updates.status;
    await report.update(updates);
    await refreshProfileCounters(report.user_id);
    res.json({ message: 'Report updated.', report });
  } catch (error) { next(error); }
};

const deleteReport = async (req, res, next) => {
  try {
    const report = await HazardReport.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (!canManage(req.user, report)) return res.status(403).json({ message: 'You can delete only your own report.' });
    await report.destroy();
    await refreshProfileCounters(report.user_id);
    res.json({ message: 'Report deleted.' });
  } catch (error) { next(error); }
};

const getMapReports = async (req, res, next) => {
  try {
    const reports = await HazardReport.findAll({ attributes: ['id', 'latitude', 'longitude', 'hazard_type', 'severity', 'status', 'location'] });
    res.json({ reports });
  } catch (error) { next(error); }
};

module.exports = { createReport, getReports, getReport, updateReport, deleteReport, getMapReports };
