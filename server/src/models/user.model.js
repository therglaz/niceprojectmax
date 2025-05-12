const { Model } = require('objection');
const bcrypt = require('bcrypt');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  // Define JSON schema for validation
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'passwordHash'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email', maxLength: 255 },
        passwordHash: { type: 'string', maxLength: 255 },
        firstName: { type: ['string', 'null'], maxLength: 100 },
        lastName: { type: ['string', 'null'], maxLength: 100 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        lastLoginAt: { type: ['string', 'null'], format: 'date-time' },
        subscriptionTier: { type: ['string', 'null'], maxLength: 50 },
        subscriptionStatus: { type: 'string', maxLength: 50 },
        subscriptionRenewalDate: { type: ['string', 'null'], format: 'date-time' },
        timezone: { type: 'string', maxLength: 50 },
        isAdmin: { type: 'boolean' },
        verificationStatus: { type: 'string', maxLength: 50 },
        verificationToken: { type: ['string', 'null'], maxLength: 255 },
        resetPasswordToken: { type: ['string', 'null'], maxLength: 255 },
        resetTokenExpiresAt: { type: ['string', 'null'], format: 'date-time' }
      }
    };
  }

  // Virtual fields (not stored in the database)
  static get virtualAttributes() {
    return ['fullName'];
  }

  // Computed property
  get fullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.firstName || this.lastName || 'User';
  }

  // Hash password before insertion
  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    if (this.password) {
      this.passwordHash = await this.hashPassword(this.password);
      delete this.password;
    }
  }

  // Hash password before update if it has changed
  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    if (this.password) {
      this.passwordHash = await this.hashPassword(this.password);
      delete this.password;
    }
    this.updatedAt = new Date().toISOString();
  }

  // Password hashing utility
  async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.passwordHash);
  }

  // Filter out sensitive data when converting to JSON
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.passwordHash;
    delete json.verificationToken;
    delete json.resetPasswordToken;
    return json;
  }
}

module.exports = User; 