const express = require('express');
const { db } = require('../database');
const { verifyToken } = require('./auth');

const router = express.Router();

// Mock insurance verification API
const mockInsuranceVerification = (insuranceProvider, policyNumber) => {
  // Simulate API processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock different scenarios based on provider
      const mockResponses = {
        'Blue Cross': {
          status: 'active',
          coverage_type: 'PPO',
          notes: 'Full coverage with $20 copay for primary care'
        },
        'Aetna': {
          status: 'active',
          coverage_type: 'HMO',
          notes: 'Network-based coverage, referral required for specialists'
        },
        'Cigna': {
          status: 'pending',
          coverage_type: 'EPO',
          notes: 'Verification pending - contact insurance provider'
        },
        'UnitedHealth': {
          status: 'active',
          coverage_type: 'PPO',
          notes: 'Premium coverage with low deductible'
        },
        default: {
          status: Math.random() > 0.7 ? 'inactive' : 'active',
          coverage_type: ['PPO', 'HMO', 'EPO'][Math.floor(Math.random() * 3)],
          notes: 'Standard coverage verified'
        }
      };

      const response = mockResponses[insuranceProvider] || mockResponses.default;
      resolve(response);
    }, 1500); // 1.5 second delay to simulate API call
  });
};

// Verify insurance for a patient
router.post('/verify/:patientId', verifyToken, async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Get patient insurance info
    db.get('SELECT * FROM patients WHERE id = ?', [patientId], async (err, patient) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      if (!patient.insurance_provider || !patient.insurance_policy_number) {
        return res.status(400).json({ error: 'Patient insurance information is incomplete' });
      }

      try {
        // Call mock insurance API
        const verificationResult = await mockInsuranceVerification(
          patient.insurance_provider,
          patient.insurance_policy_number
        );

        // Store verification result
        db.run(`
          INSERT INTO insurance_verifications (patient_id, status, coverage_type, notes)
          VALUES (?, ?, ?, ?)
        `, [
          patientId,
          verificationResult.status,
          verificationResult.coverage_type,
          verificationResult.notes
        ], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to store verification result' });
          }

          res.json({
            message: 'Insurance verification completed',
            verificationId: this.lastID,
            result: verificationResult,
            patient: {
              name: `${patient.first_name} ${patient.last_name}`,
              insurance_provider: patient.insurance_provider,
              policy_number: patient.insurance_policy_number
            }
          });
        });
      } catch (error) {
        res.status(500).json({ error: 'Insurance verification failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get insurance verification history for a patient
router.get('/history/:patientId', verifyToken, (req, res) => {
  const patientId = req.params.patientId;

  db.all(`
    SELECT iv.*, p.first_name, p.last_name, p.insurance_provider
    FROM insurance_verifications iv
    JOIN patients p ON iv.patient_id = p.id
    WHERE iv.patient_id = ?
    ORDER BY iv.verification_date DESC
  `, [patientId], (err, verifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(verifications);
  });
});

// Get all insurance verifications (for admin/provider view)
router.get('/all', verifyToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'provider') {
    return res.status(403).json({ error: 'Access denied' });
  }

  db.all(`
    SELECT iv.*, p.first_name, p.last_name, p.insurance_provider, p.insurance_policy_number
    FROM insurance_verifications iv
    JOIN patients p ON iv.patient_id = p.id
    ORDER BY iv.verification_date DESC
  `, [], (err, verifications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(verifications);
  });
});

// Get latest verification status for a patient
router.get('/status/:patientId', verifyToken, (req, res) => {
  const patientId = req.params.patientId;

  db.get(`
    SELECT iv.*, p.first_name, p.last_name, p.insurance_provider
    FROM insurance_verifications iv
    JOIN patients p ON iv.patient_id = p.id
    WHERE iv.patient_id = ?
    ORDER BY iv.verification_date DESC
    LIMIT 1
  `, [patientId], (err, verification) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!verification) {
      return res.status(404).json({ error: 'No verification found for this patient' });
    }

    res.json(verification);
  });
});

module.exports = router;
