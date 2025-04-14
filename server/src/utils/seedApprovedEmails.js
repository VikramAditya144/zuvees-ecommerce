const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ApprovedEmail = require('../models/ApprovedEmail');
const { USER_ROLES } = require('../config/constants');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Add approved emails
const addApprovedEmails = async () => {
  try {
    const approvedEmails = [
      {
        email: 'admin@example.com',
        role: USER_ROLES.ADMIN,
        isActive: true
      },
      {
        email: 'rider1@example.com',
        role: USER_ROLES.RIDER,
        isActive: true
      },
      {
        email: 'rider2@example.com',
        role: USER_ROLES.RIDER,
        isActive: true
      },
      {
        email: 'customer@example.com',
        role: USER_ROLES.CUSTOMER,
        isActive: true
      },
      {
        email: 'customer2@example.com',
        role: USER_ROLES.CUSTOMER,
        isActive: true
      },
      {
        email: 'amriteshindal29@gmail.com',
        role: USER_ROLES.CUSTOMER,
        isActive: true
      }
    ];
    
    // Check if emails already exist
    for (const emailData of approvedEmails) {
      const existingEmail = await ApprovedEmail.findOne({ email: emailData.email });
      
      if (!existingEmail) {
        await ApprovedEmail.create(emailData);
        console.log(`Added approved email: ${emailData.email} with role ${emailData.role}`);
      } else {
        console.log(`Email ${emailData.email} already approved, skipping`);
      }
    }
    
    console.log('Approved emails added successfully');
  } catch (error) {
    console.error('Error adding approved emails:', error);
    process.exit(1);
  }
};

// Run the script
const run = async () => {
  try {
    await connectDB();
    await addApprovedEmails();
    
    console.log('Process completed successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error running script:', error);
    process.exit(1);
  }
};

run();