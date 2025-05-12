const knex = require('knex');
const { knexSnakeCaseMappers } = require('objection');
const logger = require('../utils/logger');

// Load environment variables
const env = process.env.NODE_ENV || 'development';

// Database connection configuration
const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'automateeasy',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../db/migrations'
  },
  seeds: {
    directory: '../db/seeds'
  },
  // Convert camelCase to snake_case and vice versa
  ...knexSnakeCaseMappers()
};

// Initialize database connection
const db = knex(config);

// Test database connection
db.raw('SELECT 1')
  .then(() => {
    logger.info(`Database connection established (${env} environment)`);
  })
  .catch((err) => {
    logger.error('Database connection failed:', err);
  });

module.exports = db; 