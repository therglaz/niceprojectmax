const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Make.com API Service
 * 
 * This service handles all interactions with the Make.com API,
 * including authentication, scenario management, and execution monitoring.
 * 
 * API Documentation: https://www.make.com/en/api-documentation
 */
class MakeService {
  constructor() {
    this.apiKey = process.env.MAKE_API_KEY;
    this.baseUrl = 'https://eu1.make.com/api/v2';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.apiKey}`
    };

    // Validate API key during initialization
    if (!this.apiKey) {
      logger.warn('Make.com API key is not configured. Make.com integration will not work.');
    }
  }

  /**
   * Create API client with authorization headers
   * @returns {Object} Axios instance
   */
  createClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: this.headers,
      timeout: 10000
    });
  }

  /**
   * Get all teams
   * @returns {Promise<Array>} List of teams
   */
  async getTeams() {
    try {
      const client = this.createClient();
      const response = await client.get('/teams');
      return response.data;
    } catch (error) {
      logger.error('Error fetching Make.com teams:', error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get all scenarios for a team
   * @param {string} teamId - Team ID
   * @returns {Promise<Array>} List of scenarios
   */
  async getScenarios(teamId) {
    try {
      if (!teamId) {
        throw new Error('Team ID is required');
      }
      
      const client = this.createClient();
      const response = await client.get(`/teams/${teamId}/scenarios`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching Make.com scenarios for team ${teamId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get scenario details
   * @param {string} scenarioId - Scenario ID
   * @returns {Promise<Object>} Scenario details
   */
  async getScenario(scenarioId) {
    try {
      if (!scenarioId) {
        throw new Error('Scenario ID is required');
      }
      
      const client = this.createClient();
      const response = await client.get(`/scenarios/${scenarioId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error fetching Make.com scenario ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Clone an existing scenario
   * @param {string} scenarioId - Source scenario ID to clone
   * @param {string} teamId - Team ID where to create the clone
   * @param {string} name - New scenario name
   * @returns {Promise<Object>} New scenario details
   */
  async cloneScenario(scenarioId, teamId, name) {
    try {
      if (!scenarioId || !teamId) {
        throw new Error('Scenario ID and Team ID are required');
      }
      
      const client = this.createClient();
      const response = await client.post(`/scenarios/${scenarioId}/clone`, {
        teamId,
        name: name || `Clone of ${scenarioId}`
      });
      
      logger.info(`Scenario ${scenarioId} cloned successfully to team ${teamId}`);
      return response.data;
    } catch (error) {
      logger.error(`Error cloning Make.com scenario ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Update a scenario
   * @param {string} scenarioId - Scenario ID to update
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated scenario details
   */
  async updateScenario(scenarioId, data) {
    try {
      if (!scenarioId) {
        throw new Error('Scenario ID is required');
      }
      
      const client = this.createClient();
      const response = await client.patch(`/scenarios/${scenarioId}`, data);
      
      logger.info(`Scenario ${scenarioId} updated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Error updating Make.com scenario ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Activate a scenario
   * @param {string} scenarioId - Scenario ID to activate
   * @returns {Promise<Object>} Activation status
   */
  async activateScenario(scenarioId) {
    try {
      if (!scenarioId) {
        throw new Error('Scenario ID is required');
      }
      
      const client = this.createClient();
      const response = await client.post(`/scenarios/${scenarioId}/activate`);
      
      logger.info(`Scenario ${scenarioId} activated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Error activating Make.com scenario ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Deactivate a scenario
   * @param {string} scenarioId - Scenario ID to deactivate
   * @returns {Promise<Object>} Deactivation status
   */
  async deactivateScenario(scenarioId) {
    try {
      if (!scenarioId) {
        throw new Error('Scenario ID is required');
      }
      
      const client = this.createClient();
      const response = await client.post(`/scenarios/${scenarioId}/deactivate`);
      
      logger.info(`Scenario ${scenarioId} deactivated successfully`);
      return response.data;
    } catch (error) {
      logger.error(`Error deactivating Make.com scenario ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get scenario executions
   * @param {string} scenarioId - Scenario ID
   * @param {Object} options - Query parameters
   * @returns {Promise<Array>} Scenario executions
   */
  async getScenarioExecutions(scenarioId, options = {}) {
    try {
      if (!scenarioId) {
        throw new Error('Scenario ID is required');
      }
      
      const client = this.createClient();
      const response = await client.get(`/scenarios/${scenarioId}/executions`, {
        params: options
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Error fetching Make.com scenario executions for ${scenarioId}:`, error.message);
      throw this.handleApiError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleApiError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      return new Error(`Make.com API Error (${status}): ${data.message || JSON.stringify(data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('Make.com API Error: No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return error;
    }
  }
}

// Export as singleton
module.exports = new MakeService(); 