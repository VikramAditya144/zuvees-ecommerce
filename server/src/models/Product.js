const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES } = require('../config/constants');

// Schema for product variants (color and size)
const variantSchema = mongoose.Schema(
  {
    color: {
      name: {
        type: String,
        required: [true, 'Please provide a color name']
      },
      code: {
        type: String,
        required: [true, 'Please provide a color code (hex)']
      }
    },
    size: {
      type: String,
      required: [true, 'Please provide a size']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price for this variant'],
      min: [0, 'Price must be positive']
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative']
    },
    sku: {
      type: String,
      required: [true, 'Please provide a SKU']
    }
  },
  {
    _id: true
  }
);

// Main product schema
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description']
    },
    category: {
      type: String,
      required: [true, 'Please provide a product category'],
      enum: [PRODUCT_CATEGORIES.FAN, PRODUCT_CATEGORIES.AC]
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand name']
    },
    images: [
      {
        type: String,
        required: [true, 'Please provide at least one image URL']
      }
    ],
    variants: [variantSchema],
    features: [{
      type: String
    }],
    specifications: {
      type: Map,
      of: String
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for base price (lowest variant price)
productSchema.virtual('basePrice').get(function() {
  if (this.variants && this.variants.length > 0) {
    return Math.min(...this.variants.map(variant => variant.price));
  }
  return null;
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;