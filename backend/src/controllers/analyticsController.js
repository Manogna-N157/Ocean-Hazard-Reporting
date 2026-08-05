const { SocialMediaAnalytics } = require('../models');

const getSocialAnalytics = async (req, res, next) => {
  try {
    const analytics = await SocialMediaAnalytics.findAll({ order: [['mentions', 'DESC'], ['date', 'DESC']] });
    res.json({ message: 'Sample social media analytics data.', trendingKeywords: analytics });
  } catch (error) { next(error); }
};

module.exports = { getSocialAnalytics };
