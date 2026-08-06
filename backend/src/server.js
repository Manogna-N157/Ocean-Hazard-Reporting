require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
require('./models');
const { runMigrations } = require('../database/migrate');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
// Supports standard HTML form submissions in addition to JSON requests.
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => res.json({ message: 'Ocean Hazard Platform API is running.' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use(errorHandler);

const port = process.env.PORT || 5000;
sequelize.authenticate()
  .then(runMigrations)
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
