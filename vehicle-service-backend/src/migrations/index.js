const pool = require('../config/db');

const runMigrations = async () => {
  try {

    // 1. ROLES TABLE — created first because users depends on it
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        role_id   SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL
      );
    `);
    console.log('✅ Roles table ready');

    // Seed default roles (skips if they already exist)
    await pool.query(`
      INSERT INTO roles (role_name)
      VALUES ('Service Center Manager'), ('Supervisor'), ('Cashier'), ('Service Staff'), ('Customer')
      ON CONFLICT (role_name) DO NOTHING;
    `);
    console.log('✅ Default roles seeded');

    // 2. CENTRAL USERS TABLE — handles all authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id        SERIAL PRIMARY KEY,
        email          VARCHAR(150) UNIQUE NOT NULL,
        password_hash  VARCHAR(255) NOT NULL,
        role_id        INT NOT NULL REFERENCES roles(role_id) ON DELETE RESTRICT,
        account_status VARCHAR(30) DEFAULT 'active',
        created_at     TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Users table ready');

    // 3. STAFF PROFILE TABLE — 1-to-1 with users (Admin, Manager, Mechanic)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS staff (
        user_id   INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
        full_name VARCHAR(150) NOT NULL,
        phone_no  VARCHAR(20)
      );
    `);
    console.log('✅ Staff table ready');

    // 4. CUSTOMER PROFILE TABLE — 1-to-1 with users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        user_id   INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
        full_name VARCHAR(150) NOT NULL,
        phone     VARCHAR(20),
        address   TEXT
      );
    `);
    console.log('✅ Customers table ready');

    // // 5. VEHICLES TABLE
    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS vehicles (
    //     id            SERIAL PRIMARY KEY,
    //     customer_id   INT NOT NULL REFERENCES customers(user_id) ON DELETE CASCADE,
    //     make          VARCHAR(100) NOT NULL,
    //     model         VARCHAR(100) NOT NULL,
    //     year          INT NOT NULL,
    //     license_plate VARCHAR(50) UNIQUE NOT NULL,
    //     created_at    TIMESTAMP DEFAULT NOW()
    //   );
    // `);
    // console.log('✅ Vehicles table ready');

    // // 6. APPOINTMENTS TABLE
    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS appointments (
    //     id           SERIAL PRIMARY KEY,
    //     vehicle_id   INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    //     customer_id  INT NOT NULL REFERENCES customers(user_id) ON DELETE CASCADE,
    //     service_type VARCHAR(150) NOT NULL,
    //     status       VARCHAR(50) DEFAULT 'pending',
    //     scheduled_at TIMESTAMP NOT NULL,
    //     notes        TEXT,
    //     created_at   TIMESTAMP DEFAULT NOW()
    //   );
    // `);
    // console.log('✅ Appointments table ready');

    // // 7. SERVICE RECORDS TABLE
    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS service_records (
    //     id             SERIAL PRIMARY KEY,
    //     appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    //     mechanic_id    INT REFERENCES staff(user_id) ON DELETE SET NULL,
    //     work_done      TEXT,
    //     cost           NUMERIC(10, 2),
    //     completed_at   TIMESTAMP DEFAULT NOW()
    //   );
    // `);
    // console.log('✅ Service records table ready');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
};

module.exports = runMigrations;