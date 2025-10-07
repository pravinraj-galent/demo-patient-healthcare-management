const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'healthcare.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table (for authentication)
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'patient',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Patients table
      db.run(`
        CREATE TABLE IF NOT EXISTS patients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          date_of_birth DATE,
          phone TEXT,
          address TEXT,
          insurance_provider TEXT,
          insurance_policy_number TEXT,
          id_card_path TEXT,
          insurance_card_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Insurance verification table
      db.run(`
        CREATE TABLE IF NOT EXISTS insurance_verifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          status TEXT NOT NULL,
          coverage_type TEXT,
          verification_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          notes TEXT,
          FOREIGN KEY (patient_id) REFERENCES patients (id)
        )
      `);

      // Encounters table
      db.run(`
        CREATE TABLE IF NOT EXISTS encounters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_id INTEGER,
          provider_name TEXT NOT NULL,
          encounter_date DATE NOT NULL,
          diagnosis_code TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (patient_id) REFERENCES patients (id)
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initializeDatabase };
