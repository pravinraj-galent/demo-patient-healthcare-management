const express = require('express');
const multer = require('multer');
const path = require('path');
const { db } = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf files are allowed'));
    }
  }
});

// Create or update patient profile
router.post('/profile', verifyToken, upload.fields([
  { name: 'id_card', maxCount: 1 },
  { name: 'insurance_card', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      first_name,
      last_name,
      date_of_birth,
      phone,
      address,
      insurance_provider,
      insurance_policy_number
    } = req.body;

    const userId = req.user.userId;
    const id_card_path = req.files?.id_card?.[0]?.filename;
    const insurance_card_path = req.files?.insurance_card?.[0]?.filename;

    // Check if patient profile already exists
    db.get('SELECT * FROM patients WHERE user_id = ?', [userId], (err, existingPatient) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingPatient) {
        // Update existing profile
        db.run(`
          UPDATE patients SET 
            first_name = ?, last_name = ?, date_of_birth = ?, phone = ?, 
            address = ?, insurance_provider = ?, insurance_policy_number = ?,
            id_card_path = COALESCE(?, id_card_path),
            insurance_card_path = COALESCE(?, insurance_card_path)
          WHERE user_id = ?
        `, [
          first_name, last_name, date_of_birth, phone, address,
          insurance_provider, insurance_policy_number,
          id_card_path, insurance_card_path, userId
        ], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to update patient profile' });
          }
          res.json({ message: 'Patient profile updated successfully', patientId: existingPatient.id });
        });
      } else {
        // Create new profile
        db.run(`
          INSERT INTO patients (
            user_id, first_name, last_name, date_of_birth, phone, address,
            insurance_provider, insurance_policy_number, id_card_path, insurance_card_path
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          userId, first_name, last_name, date_of_birth, phone, address,
          insurance_provider, insurance_policy_number, id_card_path, insurance_card_path
        ], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create patient profile' });
          }
          res.status(201).json({ 
            message: 'Patient profile created successfully', 
            patientId: this.lastID 
          });
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get patient profile
router.get('/profile', verifyToken, (req, res) => {
  const userId = req.user.userId;

  db.get(`
    SELECT p.*, u.email 
    FROM patients p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.user_id = ?
  `, [userId], (err, patient) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.json(patient);
  });
});

// Get all patients (for admin/provider view)
router.get('/all', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.all(`
    SELECT p.*, u.email 
    FROM patients p 
    JOIN users u ON p.user_id = u.id 
    ORDER BY p.created_at DESC
  `, [], (err, patients) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(patients);
  });
});

// Get specific patient by ID (for admin/provider view)
router.get('/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const patientId = req.params.id;

  db.get(`
    SELECT p.*, u.email 
    FROM patients p 
    JOIN users u ON p.user_id = u.id 
    WHERE p.id = ?
  `, [patientId], (err, patient) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  });
});

module.exports = router;
