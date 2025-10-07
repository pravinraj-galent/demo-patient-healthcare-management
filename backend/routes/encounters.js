const express = require('express');
const { db } = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Create new encounter
router.post('/', verifyToken, (req, res) => {
  try {
    const {
      patient_id,
      provider_name,
      encounter_date,
      diagnosis_code,
      notes
    } = req.body;

    // Validate required fields
    if (!patient_id || !provider_name || !encounter_date) {
      return res.status(400).json({ 
        error: 'Patient ID, provider name, and encounter date are required' 
      });
    }

    // Verify patient exists
    db.get('SELECT * FROM patients WHERE id = ?', [patient_id], (err, patient) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      // Create encounter
      db.run(`
        INSERT INTO encounters (patient_id, provider_name, encounter_date, diagnosis_code, notes)
        VALUES (?, ?, ?, ?, ?)
      `, [
        patient_id,
        provider_name,
        encounter_date,
        diagnosis_code,
        notes
      ], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create encounter' });
        }

        res.status(201).json({
          message: 'Encounter created successfully',
          encounterId: this.lastID,
          encounter: {
            id: this.lastID,
            patient_id,
            provider_name,
            encounter_date,
            diagnosis_code,
            notes
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all encounters for a specific patient
router.get('/patient/:patientId', verifyToken, (req, res) => {
  const patientId = req.params.patientId;

  db.all(`
    SELECT e.*, p.first_name, p.last_name
    FROM encounters e
    JOIN patients p ON e.patient_id = p.id
    WHERE e.patient_id = ?
    ORDER BY e.encounter_date DESC
  `, [patientId], (err, encounters) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(encounters);
  });
});

// Get all encounters (for admin/provider view)
router.get('/all', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.all(`
    SELECT e.*, p.first_name, p.last_name, p.date_of_birth
    FROM encounters e
    JOIN patients p ON e.patient_id = p.id
    ORDER BY e.encounter_date DESC
  `, [], (err, encounters) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(encounters);
  });
});

// Get specific encounter by ID
router.get('/:id', verifyToken, (req, res) => {
  const encounterId = req.params.id;

  db.get(`
    SELECT e.*, p.first_name, p.last_name, p.date_of_birth, p.insurance_provider
    FROM encounters e
    JOIN patients p ON e.patient_id = p.id
    WHERE e.id = ?
  `, [encounterId], (err, encounter) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!encounter) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    res.json(encounter);
  });
});

// Update encounter
router.put('/:id', verifyToken, (req, res) => {
  try {
    const encounterId = req.params.id;
    const {
      provider_name,
      encounter_date,
      diagnosis_code,
      notes
    } = req.body;

    db.run(`
      UPDATE encounters 
      SET provider_name = ?, encounter_date = ?, diagnosis_code = ?, notes = ?
      WHERE id = ?
    `, [
      provider_name,
      encounter_date,
      diagnosis_code,
      notes,
      encounterId
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update encounter' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Encounter not found' });
      }

      res.json({ message: 'Encounter updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete encounter
router.delete('/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const encounterId = req.params.id;

  db.run('DELETE FROM encounters WHERE id = ?', [encounterId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete encounter' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Encounter not found' });
    }

    res.json({ message: 'Encounter deleted successfully' });
  });
});

// Get encounter statistics
router.get('/stats/summary', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const queries = [
    'SELECT COUNT(*) as total_encounters FROM encounters',
    'SELECT COUNT(DISTINCT patient_id) as unique_patients FROM encounters',
    'SELECT COUNT(DISTINCT provider_name) as unique_providers FROM encounters',
    `SELECT COUNT(*) as recent_encounters FROM encounters 
     WHERE encounter_date >= date('now', '-30 days')`
  ];

  let completed = 0;
  const results = {};

  queries.forEach((query, index) => {
    db.get(query, [], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const keys = ['total_encounters', 'unique_patients', 'unique_providers', 'recent_encounters'];
      results[keys[index]] = Object.values(result)[0];
      
      completed++;
      if (completed === queries.length) {
        res.json(results);
      }
    });
  });
});

module.exports = router;
