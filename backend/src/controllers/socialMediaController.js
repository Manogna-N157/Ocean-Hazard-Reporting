const fs = require('fs/promises');
const { SocialMediaAnalysis, HazardReport, User } = require('../models');
const { analyzeSocialMediaContent } = require('../services/geminiService');
const { extractPublicPageText } = require('../services/publicPageExtractor');

const uploadPath = (file) => file ? `/uploads/${file.filename}` : null;
const HAZARD_TYPE_MAP = {
  'Cyclone Damage': 'Cyclone',
  'Coastal Flooding': 'Other',
  'Ship Accident': 'Other',
};

const serialize = (analysis) => ({ ...analysis.toJSON(), shouldInvestigate: analysis.should_investigate });

const saveAnalysis = async ({ req, inputType, originalText = null, originalUrl = null, extractedText = null, imagePath = null, imageBuffer = null, mimeType = null }) => {
  const result = await analyzeSocialMediaContent({ text: originalText, imageBuffer, mimeType });
  const analysis = await SocialMediaAnalysis.create({
    user_id: req.user.id, role: req.user.role, input_type: inputType, original_text: originalText, original_url: originalUrl, extracted_text: extractedText,
    uploaded_image_path: imagePath, detected_hazard: result.hazard_type, summary: result.summary,
    confidence_score: result.confidence_score, risk_level: result.risk_level, recommendation: result.recommendation,
    should_investigate: result.should_investigate,
  });
  return serialize(analysis);
};

const analyzeUrl = async (req, res, next) => {
  try {
    const url = req.body.url?.trim();
    if (!url) return res.status(400).json({ message: 'A public URL is required.' });
    const { originalUrl, extractedText } = await extractPublicPageText(url);
    const analysis = await saveAnalysis({ req, inputType: 'URL', originalText: extractedText, originalUrl, extractedText });
    res.status(201).json({ message: 'Public URL content analyzed.', analysis });
  } catch (error) { next(error); }
};

const analyzeText = async (req, res, next) => {
  try {
    const originalText = req.body.text?.trim();
    if (!originalText) return res.status(400).json({ message: 'Social-media post text is required.' });
    const analysis = await saveAnalysis({ req, inputType: 'Text', originalText });
    res.status(201).json({ message: 'Social-media text analyzed.', analysis });
  } catch (error) { next(error); }
};

const analyzeImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'A social-media screenshot image is required.' });
    const analysis = await saveAnalysis({ req, inputType: 'Image', imagePath: uploadPath(req.file), imageBuffer: await fs.readFile(req.file.path), mimeType: req.file.mimetype });
    res.status(201).json({ message: 'Social-media screenshot analyzed.', analysis });
  } catch (error) { next(error); }
};

const getHistory = async (req, res, next) => {
  try {
    const where = req.user.role === 'Admin' ? {} : { user_id: req.user.id };
    const analyses = await SocialMediaAnalysis.findAll({ where, include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }], order: [['created_at', 'DESC']] });
    res.json({ count: analyses.length, analyses: analyses.map(serialize) });
  } catch (error) { next(error); }
};

const createOfficialReport = async (req, res, next) => {
  try {
    const analysis = await SocialMediaAnalysis.findByPk(req.body.analysis_id);
    if (!analysis) return res.status(404).json({ message: 'Social-media analysis not found.' });
    if (req.user.role !== 'Admin' && analysis.user_id !== req.user.id) return res.status(403).json({ message: 'You can create reports only from your own analyses.' });
    if (!analysis.should_investigate) return res.status(400).json({ message: 'This analysis does not recommend an official investigation.' });

    const report = await HazardReport.create({
      user_id: req.user.id,
      hazard_type: HAZARD_TYPE_MAP[analysis.detected_hazard] || (analysis.detected_hazard === 'None' ? 'Other' : analysis.detected_hazard),
      description: `${analysis.summary}\n\nRecommended action: ${analysis.recommendation}`,
      image_url: analysis.uploaded_image_path,
      location: req.body.location?.trim() || 'Location to be confirmed from social-media report',
      latitude: req.body.latitude ?? 0,
      longitude: req.body.longitude ?? 0,
      severity: analysis.risk_level,
      status: 'Pending',
    });
    res.status(201).json({ message: 'Official hazard report created and queued for verification.', report });
  } catch (error) { next(error); }
};

module.exports = { analyzeText, analyzeImage, analyzeUrl, getHistory, createOfficialReport };
