const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('../../knexfile');
const logger = require('../utils/logger');

// Select the appropriate configuration based on environment
const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Initialize knex with the selected configuration
const knex = Knex(config);

// Connect objection.js to knex
Model.knex(knex);

// Maximum retry attempts
const MAX_RETRIES = 5;
let retryCount = 0;

// Function to test database connection with retry logic
const testConnection = async () => {
  try {
    await knex.raw('SELECT 1');
    logger.info(`Database connection established (${environment} environment)`);
    return true;
  } catch (err) {
    logger.error(`Database connection failed (attempt ${retryCount + 1}/${MAX_RETRIES}):`, err.message);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff with 30s max
      logger.info(`Retrying database connection in ${retryDelay/1000} seconds...`);
      
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await testConnection());
        }, retryDelay);
      });
    } else {
      logger.error('Max retry attempts reached. Could not connect to database.');
      
      // In production, we might want to exit
      if (environment === 'production') {
        process.exit(1);
      }
      
      return false;
    }
  }
};

// Test the connection
testConnection().catch(err => {
  logger.error('Unexpected error during database connection:', err);
});

module.exports = knex; 