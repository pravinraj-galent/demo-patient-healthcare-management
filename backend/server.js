const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initializeDatabase } = require('./database');
const { router: authRoutes } = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const insuranceRoutes = require('./routes/insurance');
const encountersRoutes = require('./routes/encounters');

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/encounters', encountersRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare Management Backend API',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth (POST /register, POST /login)',
      patients: '/api/patients (GET, POST /profile, GET /all)',
      insurance: '/api/insurance (POST /verify/:patientId, GET /history/:patientId)',
      encounters: '/api/encounters (GET, POST, GET /patient/:patientId)'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} to see the API`);
      console.log('Database initialized successfully');
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

module.exports = app;
