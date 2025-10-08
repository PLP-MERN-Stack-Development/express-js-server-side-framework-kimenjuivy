// routes/stats.js - Product statistics endpoints

const express = require('express');
const router = express.Router();

// Get product statistics
router.get('/', (req, res, next) => {
  try {
    const products = req.app.get('products');
    
    // Calculate basic statistics
    const totalProducts = products.length;
    const inStockCount = products.filter(p => p.inStock).length;
    const outOfStockCount = totalProducts - inStockCount;
    const totalValue = products.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    
    // Calculate category statistics
    const categoryStats = {};
    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          count: 0,
          totalValue: 0,
          averagePrice: 0,
          inStockCount: 0
        };
      }
      
      categoryStats[product.category].count++;
      categoryStats[product.category].totalValue += product.price;
      if (product.inStock) {
        categoryStats[product.category].inStockCount++;
      }
    });
    
    // Calculate average price per category
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.averagePrice = stats.count > 0 ? stats.totalValue / stats.count : 0;
    });
    
    // Price range statistics
    const prices = products.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    res.json({
      statistics: {
        summary: {
          totalProducts,
          inStockCount,
          outOfStockCount,
          totalValue: parseFloat(totalValue.toFixed(2)),
          averagePrice: parseFloat(averagePrice.toFixed(2)),
          minPrice: parseFloat(minPrice.toFixed(2)),
          maxPrice: parseFloat(maxPrice.toFixed(2))
        },
        categories: categoryStats,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// Get statistics for specific category
router.get('/category/:category', (req, res, next) => {
  try {
    const products = req.app.get('products');
    const category = req.params.category.toLowerCase();
    
    const categoryProducts = products.filter(p => 
      p.category.toLowerCase() === category
    );
    
    if (categoryProducts.length === 0) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No products found in category: ${category}`
      });
    }
    
    const categoryStats = {
      category,
      count: categoryProducts.length,
      inStockCount: categoryProducts.filter(p => p.inStock).length,
      outOfStockCount: categoryProducts.filter(p => !p.inStock).length,
      totalValue: parseFloat(categoryProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)),
      averagePrice: parseFloat((categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length).toFixed(2)),
      minPrice: parseFloat(Math.min(...categoryProducts.map(p => p.price)).toFixed(2)),
      maxPrice: parseFloat(Math.max(...categoryProducts.map(p => p.price)).toFixed(2))
    };
    
    res.json({
      statistics: categoryStats,
      products: categoryProducts.map(p => ({ id: p.id, name: p.name, price: p.price, inStock: p.inStock }))
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;