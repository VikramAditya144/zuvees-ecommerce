const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import app
const app = require('./src/app');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});