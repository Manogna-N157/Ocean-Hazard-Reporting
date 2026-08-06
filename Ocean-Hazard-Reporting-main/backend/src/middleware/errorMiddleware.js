const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: err.errors[0].message });
  }
  const statusCode = err.statusCode || err.status || 500;
  const payload = { message: err.message || 'Internal server error.' };
  if (err.code) payload.code = err.code;
  return res.status(statusCode).json(payload);
};

module.exports = errorHandler;
