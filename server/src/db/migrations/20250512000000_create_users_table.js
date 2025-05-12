/**
 * Migration: Create Users Table
 * 
 * This creates the users table according to the schema defined in PRD Backend: 10.1.1
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100);
    table.string('last_name', 100);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('last_login_at');
    table.string('subscription_tier', 50);
    table.string('subscription_status', 50).notNullable().defaultTo('inactive');
    table.timestamp('subscription_renewal_date');
    table.string('timezone', 50).defaultTo('UTC');
    table.boolean('is_admin').defaultTo(false);
    table.string('verification_status', 50).defaultTo('unverified');
    table.string('verification_token', 255);
    table.string('reset_password_token', 255);
    table.timestamp('reset_token_expires_at');
    
    // Add indexes
    table.index('email');
    table.index('verification_status');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}; 