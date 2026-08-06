const fs = require('fs/promises');
const path = require('path');
const { HazardReport, AIAnalysis } = require('../models');
const { analyzeOceanHazardImage } = require('../services/geminiService');

const analyzeImage = async (req, res, next) => {
  try {
    const reportId = Number(req.body.report_id);
    if (!Number.isInteger(reportId) || reportId <= 0) return res.status(400).json({ message: 'A valid report_id is required.' });
    const report = await HazardReport.findByPk(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found.' });
    if (req.user.role === 'Citizen' && report.user_id !== req.user.id) return res.status(403).json({ message: 'You can analyze only your own report.' });

    let imageBuffer;
    let mimeType;
    if (req.file) {
      imageBuffer = await fs.readFile(req.file.path);
      mimeType = req.file.mimetype;
    } else if (report.image_url) {
      const filename = path.basename(report.image_url);
      imageBuffer = await fs.readFile(path.join(__dirname, '../../uploads', filename));
      mimeType = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' }[path.extname(filename).toLowerCase()] || 'image/jpeg';
    } else {
      return res.status(400).json({ message: 'Upload an image or attach one to the report before requesting AI analysis.' });
    }

    const result = await analyzeOceanHazardImage({ imageBuffer, mimeType });
    const [analysis] = await AIAnalysis.upsert({
      report_id: report.id,
      hazard_prediction: result.hazard_type,
      confidence_score: result.confidence,
      risk_level: result.severity,
      explanation: result.explanation,
      recommendation: result.recommended_action,
    });
    return res.json({
      hazard_type: result.hazard_type,
      confidence: result.confidence,
      severity: result.severity,
      explanation: result.explanation,
      recommended_action: result.recommended_action,
      hazardType: result.hazard_type,
      confidenceScore: result.confidence,
      riskLevel: result.severity,
      recommendation: result.recommended_action,
      analysis: analysis.toJSON(),
    });
  } catch (error) {
    console.error('[AI] Image analysis request failed.', {
      reportId: req.body?.report_id,
      message: error.message,
      code: error.code,
    });
    next(error);
  }
};

module.exports = { analyzeImage };
