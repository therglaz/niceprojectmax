const { AppError } = require('../middlewares/errorHandler');
const logger = require('../utils/logger');
const makeService = require('../services/make.service');

/**
 * Get all automation templates
 * @route GET /api/v1/templates
 */
exports.getTemplates = async (req, res, next) => {
  try {
    // In a real implementation, this would fetch from a database
    // For Phase 1, we'll return a static list of templates
    const templates = [
      {
        id: '1',
        name: 'Daily Social Media Posts',
        description: 'Automatically post scheduled content to multiple social media platforms.',
        category: 'Marketing',
        complexity: 'Medium',
        makeScenarioId: 'make-scenario-id-1',
        requiredConnections: ['Twitter', 'Facebook', 'LinkedIn'],
        configParameters: [
          { name: 'postFrequency', type: 'select', options: ['Daily', 'Weekly'], default: 'Daily' },
          { name: 'postTime', type: 'time', default: '09:00' }
        ],
        thumbnail: 'https://example.com/thumbnails/social-media.jpg'
      },
      {
        id: '2',
        name: 'Lead Notifications',
        description: 'Get instant notifications when new leads come in from your website.',
        category: 'Sales',
        complexity: 'Low',
        makeScenarioId: 'make-scenario-id-2',
        requiredConnections: ['Slack', 'Google Forms'],
        configParameters: [
          { name: 'notificationChannel', type: 'string', default: '#leads' }
        ],
        thumbnail: 'https://example.com/thumbnails/lead-notification.jpg'
      },
      {
        id: '3',
        name: 'Invoice Automation',
        description: 'Automatically generate and send invoices for new orders.',
        category: 'Finance',
        complexity: 'High',
        makeScenarioId: 'make-scenario-id-3',
        requiredConnections: ['Stripe', 'Gmail', 'Google Sheets'],
        configParameters: [
          { name: 'invoiceTemplate', type: 'select', options: ['Standard', 'Detailed'], default: 'Standard' },
          { name: 'sendCopy', type: 'boolean', default: true },
          { name: 'ccEmail', type: 'email', default: '' }
        ],
        thumbnail: 'https://example.com/thumbnails/invoice-automation.jpg'
      }
    ];

    res.status(200).json({
      status: 'success',
      results: templates.length,
      data: {
        templates
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific template by ID
 * @route GET /api/v1/templates/:id
 */
exports.getTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, this would fetch from a database
    // For Phase 1, we'll return a static template if ID matches
    const templates = [
      {
        id: '1',
        name: 'Daily Social Media Posts',
        description: 'Automatically post scheduled content to multiple social media platforms.',
        category: 'Marketing',
        complexity: 'Medium',
        makeScenarioId: 'make-scenario-id-1',
        requiredConnections: ['Twitter', 'Facebook', 'LinkedIn'],
        configParameters: [
          { name: 'postFrequency', type: 'select', options: ['Daily', 'Weekly'], default: 'Daily' },
          { name: 'postTime', type: 'time', default: '09:00' }
        ],
        thumbnail: 'https://example.com/thumbnails/social-media.jpg',
        longDescription: 'This automation template allows you to schedule and post content across multiple social media platforms automatically. Set the frequency and time for your posts, and the system will handle the rest.',
        benefits: [
          'Save time on repetitive social media posting',
          'Maintain consistent posting schedule',
          'Reach audiences across multiple platforms'
        ],
        setupSteps: [
          'Connect your social media accounts',
          'Configure posting schedule',
          'Add content source (RSS feed, Google Sheets, etc.)'
        ]
      },
      {
        id: '2',
        name: 'Lead Notifications',
        description: 'Get instant notifications when new leads come in from your website.',
        category: 'Sales',
        complexity: 'Low',
        makeScenarioId: 'make-scenario-id-2',
        requiredConnections: ['Slack', 'Google Forms'],
        configParameters: [
          { name: 'notificationChannel', type: 'string', default: '#leads' }
        ],
        thumbnail: 'https://example.com/thumbnails/lead-notification.jpg',
        longDescription: 'Never miss a lead again with instant notifications in your team communication platform. Any time a new lead form is submitted, your team will be alerted immediately.',
        benefits: [
          'Respond to leads faster',
          'Improve conversion rates',
          'Keep your sales team informed'
        ],
        setupSteps: [
          'Connect your form provider',
          'Configure notification settings',
          'Set up your Slack channel'
        ]
      },
      {
        id: '3',
        name: 'Invoice Automation',
        description: 'Automatically generate and send invoices for new orders.',
        category: 'Finance',
        complexity: 'High',
        makeScenarioId: 'make-scenario-id-3',
        requiredConnections: ['Stripe', 'Gmail', 'Google Sheets'],
        configParameters: [
          { name: 'invoiceTemplate', type: 'select', options: ['Standard', 'Detailed'], default: 'Standard' },
          { name: 'sendCopy', type: 'boolean', default: true },
          { name: 'ccEmail', type: 'email', default: '' }
        ],
        thumbnail: 'https://example.com/thumbnails/invoice-automation.jpg',
        longDescription: 'Automate your entire invoicing process from generation to delivery. When new orders come in, this automation creates professional invoices and sends them to your customers.',
        benefits: [
          'Eliminate manual invoice creation',
          'Reduce invoicing errors',
          'Get paid faster'
        ],
        setupSteps: [
          'Connect your payment processor',
          'Set up email delivery',
          'Configure invoice templates'
        ]
      }
    ];
    
    const template = templates.find(template => template.id === id);
    
    if (!template) {
      return next(new AppError('Template not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        template
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search templates
 * @route GET /api/v1/templates/search
 */
exports.searchTemplates = async (req, res, next) => {
  try {
    const { query, category } = req.query;
    
    // In a real implementation, this would search in a database
    // For Phase 1, we'll filter the static list
    const templates = [
      {
        id: '1',
        name: 'Daily Social Media Posts',
        description: 'Automatically post scheduled content to multiple social media platforms.',
        category: 'Marketing',
        complexity: 'Medium',
        makeScenarioId: 'make-scenario-id-1',
        requiredConnections: ['Twitter', 'Facebook', 'LinkedIn'],
        thumbnail: 'https://example.com/thumbnails/social-media.jpg'
      },
      {
        id: '2',
        name: 'Lead Notifications',
        description: 'Get instant notifications when new leads come in from your website.',
        category: 'Sales',
        complexity: 'Low',
        makeScenarioId: 'make-scenario-id-2',
        requiredConnections: ['Slack', 'Google Forms'],
        thumbnail: 'https://example.com/thumbnails/lead-notification.jpg'
      },
      {
        id: '3',
        name: 'Invoice Automation',
        description: 'Automatically generate and send invoices for new orders.',
        category: 'Finance',
        complexity: 'High',
        makeScenarioId: 'make-scenario-id-3',
        requiredConnections: ['Stripe', 'Gmail', 'Google Sheets'],
        thumbnail: 'https://example.com/thumbnails/invoice-automation.jpg'
      }
    ];

    let filteredTemplates = [...templates];
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredTemplates = filteredTemplates.filter(
        template => template.name.toLowerCase().includes(searchTerm) || 
                   template.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (category) {
      filteredTemplates = filteredTemplates.filter(
        template => template.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.status(200).json({
      status: 'success',
      results: filteredTemplates.length,
      data: {
        templates: filteredTemplates
      }
    });
  } catch (error) {
    next(error);
  }
}; 