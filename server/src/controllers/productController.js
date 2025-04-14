const Product = require('../models/Product');
const { getPaginationParams, createResponse, formatProductResponse } = require('../utils/helpers');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all products with pagination, filtering and search
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const { category, minPrice, maxPrice, q } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Add price filter if provided
    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      
      if (minPrice) {
        filter['variants.price'].$gte = parseFloat(minPrice);
      }
      
      if (maxPrice) {
        filter['variants.price'].$lte = parseFloat(maxPrice);
      }
    }
    
    // Add search filter if provided
    if (q) {
      filter.$text = { $search: q };
    }
    
    // Get total count
    const total = await Product.countDocuments(filter);
    
    // Get products with pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Format product data
    const formattedProducts = products.map(formatProductResponse);
    
    // Pagination metadata
    const meta = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };
    
    res.status(200).json(
      createResponse(true, 'Products retrieved successfully', formattedProducts, meta)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });
    
    if (!product) {
      return next(
        new ErrorResponse('Product not found', 404)
      );
    }
    
    res.status(200).json(
      createResponse(true, 'Product retrieved successfully', formatProductResponse(product))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json(
      createResponse(true, 'Product created successfully', formatProductResponse(product))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(
        new ErrorResponse('Product not found', 404)
      );
    }
    
    // Update product
    Object.keys(req.body).forEach(key => {
      product[key] = req.body[key];
    });
    
    await product.save();
    
    res.status(200).json(
      createResponse(true, 'Product updated successfully', formatProductResponse(product))
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return next(
        new ErrorResponse('Product not found', 404)
      );
    }
    
    // Soft delete
    product.isActive = false;
    await product.save();
    
    res.status(200).json(
      createResponse(true, 'Product deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};