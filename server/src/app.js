const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ErrorResponse = require('./utils/errorResponse');
const errorHandler = require('./middleware/errorHandler');
const { createResponse } = require('./utils/helpers');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// CORS setup
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.RIDER_APP_URL
  ],
  credentials: true
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/rider', require('./routes/riderRoutes'));

// Swagger documentation route
app.use('/api-docs', require('./routes/swaggerRoutes'));


// Root route
app.get('/', (req, res) => {
  res.json(createResponse(true, 'E-Commerce API is running'));
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response
  });

// RENDER A HTML FILE IN TEMPLATES FOLDER NAMED auth.html
app.get('/auth', (req, res) => {
  res.sendFile('auth.html', { root: 'src/templates' });
});

// Add a catch-all route for Google OAuth errors
app.get('/oauth-error', (req, res) => {
    res.send('OAuth Error: ' + (req.query.error || 'Unknown error'));
  });

// 404 Handler
app.use((req, res, next) => {
  next(new ErrorResponse(`Route not found: ${req.originalUrl}`, 404));
});

// Error Handler
app.use(errorHandler);

module.exports = app;