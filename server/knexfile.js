require('dotenv').config();
const { knexSnakeCaseMappers } = require('objection');
const parse = require('pg-connection-string').parse;

// Support for both DATABASE_URL and individual connection parameters
const getDatabaseConfig = (envUrl, fallbackConfig) => {
  if (envUrl) {
    // Parse the connection string
    const dbConfig = parse(envUrl);
    
    return {
      host: dbConfig.host,
      port: dbConfig.port || 5432,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      ssl: { rejectUnauthorized: false }
    };
  }
  return fallbackConfig;
};

module.exports = {
  development: {
    client: 'pg',
    connection: getDatabaseConfig(process.env.DATABASE_URL, {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'automateeasy',
    }),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    },
    ...knexSnakeCaseMappers()
  },

  test: {
    client: 'pg',
    connection: getDatabaseConfig(process.env.TEST_DATABASE_URL, {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      database: process.env.TEST_DB_NAME || 'automateeasy_test',
    }),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    seeds: {
      directory: './src/db/seeds'
    },
    ...knexSnakeCaseMappers()
  },

  staging: {
    client: 'pg',
    connection: getDatabaseConfig(process.env.DATABASE_URL, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    }),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    ...knexSnakeCaseMappers()
  },

  production: {
    client: 'pg',
    connection: getDatabaseConfig(process.env.DATABASE_URL, {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    }),
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/db/migrations'
    },
    ...knexSnakeCaseMappers()
  }
}; 