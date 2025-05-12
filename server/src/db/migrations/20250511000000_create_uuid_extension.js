/**
 * Migration: Create UUID Extension
 * 
 * This adds the uuid-ossp extension to PostgreSQL to support UUID generation
 */
exports.up = function(knex) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
};

exports.down = function(knex) {
  return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
}; 