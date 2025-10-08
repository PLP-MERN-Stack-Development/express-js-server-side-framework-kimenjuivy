// routes/products.js - Product CRUD operations with advanced features

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { NotFoundError } = require('../utils/errors');
const { validateProduct, validateProductUpdate } = require('../middleware/validation');

const router = express.Router();

// Get products with filtering, pagination, and search
router.get('/', (req, res, next) => {
  try {
    let filteredProducts = [...req.app.get('products')];
    
    // Search by name (case-insensitive)
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }
    
    // Filter by inStock status
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === 'true';
      filteredProducts = filteredProducts.filter(product => product.inStock === inStock);
    }
    
    // Filter by price range
    if (req.query.minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(req.query.maxPrice));
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Response with pagination metadata
    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: endIndex < totalProducts,
        hasPrev: startIndex > 0,
        limit
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// Get specific product by ID
router.get('/:id', (req, res, next) => {
  try {
    const products = req.app.get('products');
    const product = products.find(p => p.id === req.params.id);
    
    if (!product) {
      throw new NotFoundError('Product');
    }
    
    res.json({
      product,
      message: 'Product retrieved successfully'
    });
    
  } catch (error) {
    next(error);
  }
});

// Create new product
router.post('/', validateProduct, (req, res, next) => {
  try {
    const products = req.app.get('products');
    const newProduct = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      inStock: req.body.inStock !== undefined ? req.body.inStock : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    req.app.set('products', products);
    
    res.status(201).json({
      product: newProduct,
      message: 'Product created successfully'
    });
    
  } catch (error) {
    next(error);
  }
});

// Update existing product
router.put('/:id', validateProductUpdate, (req, res, next) => {
  try {
    const products = req.app.get('products');
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      throw new NotFoundError('Product');
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    // Ensure price is a number
    if (req.body.price !== undefined) {
      updatedProduct.price = parseFloat(req.body.price);
    }
    
    products[productIndex] = updatedProduct;
    req.app.set('products', products);
    
    res.json({
      product: updatedProduct,
      message: 'Product updated successfully'
    });
    
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', (req, res, next) => {
  try {
    const products = req.app.get('products');
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      throw new NotFoundError('Product');
    }
    
    const deletedProduct = products.splice(productIndex, 1)[0];
    req.app.set('products', products);
    
    res.json({
      product: deletedProduct,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
});

// Search products by name (dedicated endpoint)
router.get('/search/:term', (req, res, next) => {
  try {
    const products = req.app.get('products');
    const searchTerm = req.params.term.toLowerCase();
    
    const matchingProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
    
    res.json({
      products: matchingProducts,
      searchTerm,
      count: matchingProducts.length,
      message: `Found ${matchingProducts.length} products matching "${searchTerm}"`
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;