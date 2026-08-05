const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: err.errors[0].message });
  }
  return res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error.' });
};

module.exports = errorHandler;
