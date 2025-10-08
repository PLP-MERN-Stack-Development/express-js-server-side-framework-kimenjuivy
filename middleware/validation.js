// middleware/validation.js - Input validation middleware for products

const { ValidationError } = require('../utils/errors');

/**
 * Validation rules for product creation
 */
const productValidationRules = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  description: {
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 500
  },
  price: {
    required: true,
    type: 'number',
    min: 0,
    max: 1000000
  },
  category: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50
  },
  inStock: {
    required: false,
    type: 'boolean',
    default: true
  }
};

/**
 * Middleware to validate product data for creation
 */
const validateProduct = (req, res, next) => {
  const errors = [];
  const productData = req.body;
  
  // Check required fields
  Object.keys(productValidationRules).forEach(field => {
    const rule = productValidationRules[field];
    
    if (rule.required && (productData[field] === undefined || productData[field] === null)) {
      errors.push(`${field} is required`);
      return;
    }
    
    if (productData[field] !== undefined && productData[field] !== null) {
      // Type validation
      if (rule.type === 'number' && isNaN(Number(productData[field]))) {
        errors.push(`${field} must be a number`);
      } else if (rule.type === 'boolean' && typeof productData[field] !== 'boolean') {
        errors.push(`${field} must be a boolean`);
      } else if (rule.type === 'string' && typeof productData[field] !== 'string') {
        errors.push(`${field} must be a string`);
      }
      
      // Length validation for strings
      if (rule.type === 'string' && typeof productData[field] === 'string') {
        if (rule.minLength && productData[field].length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters long`);
        }
        if (rule.maxLength && productData[field].length > rule.maxLength) {
          errors.push(`${field} must be at most ${rule.maxLength} characters long`);
        }
      }
      
      // Range validation for numbers
      if (rule.type === 'number' && !isNaN(Number(productData[field]))) {
        const numValue = Number(productData[field]);
        if (rule.min !== undefined && numValue < rule.min) {
          errors.push(`${field} must be at least ${rule.min}`);
        }
        if (rule.max !== undefined && numValue > rule.max) {
          errors.push(`${field} must be at most ${rule.max}`);
        }
      }
    }
  });
  
  // Check for unknown fields
  const allowedFields = Object.keys(productValidationRules);
  Object.keys(productData).forEach(field => {
    if (!allowedFields.includes(field)) {
      errors.push(`Unknown field: ${field}`);
    }
  });
  
  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }
  
  next();
};

/**
 * Middleware to validate product data for updates (all fields optional but must be valid if provided)
 */
const validateProductUpdate = (req, res, next) => {
  const errors = [];
  const productData = req.body;
  
  // Check each provided field against validation rules
  Object.keys(productData).forEach(field => {
    if (!productValidationRules[field]) {
      errors.push(`Unknown field: ${field}`);
      return;
    }
    
    const rule = productValidationRules[field];
    const value = productData[field];
    
    // Type validation
    if (rule.type === 'number' && isNaN(Number(value))) {
      errors.push(`${field} must be a number`);
    } else if (rule.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`${field} must be a boolean`);
    } else if (rule.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
    }
    
    // Length validation for strings
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters long`);
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters long`);
      }
    }
    
    // Range validation for numbers
    if (rule.type === 'number' && !isNaN(Number(value))) {
      const numValue = Number(value);
      if (rule.min !== undefined && numValue < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
      }
      if (rule.max !== undefined && numValue > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
      }
    }
  });
  
  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }
  
  next();
};

module.exports = {
  validateProduct,
  validateProductUpdate
};