const pool = require('../config/db');

const runMigrations = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table ready');

    // Vehicles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        license_plate VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Vehicles table ready');

    // Service appointments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        service_type VARCHAR(150) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        scheduled_at TIMESTAMP NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Appointments table ready');

    // Service records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS service_records (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES appointments(id) ON DELETE CASCADE,
        technician_name VARCHAR(100),
        work_done TEXT,
        cost NUMERIC(10, 2),
        completed_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Service records table ready');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1); // Stop server if tables can't be created
  }
};

module.exports = runMigrations;
