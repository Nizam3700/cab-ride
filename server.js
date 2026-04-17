const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const driverRoutes = require('./src/routes/driverRoutes');
const rideRoutes = require('./src/routes/rideRoutes');
const { initDatabase } = require('./src/models/init');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', rideRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;