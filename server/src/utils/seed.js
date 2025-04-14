const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const ApprovedEmail = require('../models/ApprovedEmail');
const { USER_ROLES, PRODUCT_CATEGORIES } = require('../config/constants');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Clear existing data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    await ApprovedEmail.deleteMany({});
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Seed approved emails
// const seedApprovedEmails = async () => {
//   try {
//     const approvedEmails = [
//       {
//         email: 'admin@example.com',
//         role: USER_ROLES.ADMIN,
//         isActive: true
//       }
//     ];
    
//     const created = await User.create(users);
//     console.log(`Users seeded: ${created.length} users created`);
//   } catch (error) {
//     console.error('Error seeding users:', error);
//     process.exit(1);
//   }
// };

const seedApprovedEmails = async () => {
  try {
    const approvedEmails = [
      {
        email: 'admin@example.com',
        role: USER_ROLES.ADMIN,
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

// Seed products (with placeholder image URLs)
const seedProducts = async () => {
  try {
    const products = [
      // Product 1: Tower Fan
      {
        name: 'Tower Fan Pro',
        description: 'Elegant tower fan with 3-speed settings, remote control, and oscillation feature for efficient air circulation in medium to large rooms.',
        category: PRODUCT_CATEGORIES.FAN,
        brand: 'CoolBreeze',
        images: [
          'https://example.com/images/towerfan1.jpg',
          'https://example.com/images/towerfan2.jpg',
          'https://example.com/images/towerfan3.jpg'
        ],
        variants: [
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: 'Standard',
            price: 89.99,
            stock: 25,
            sku: 'TF-WHT-STD'
          },
          {
            color: {
              name: 'Black',
              code: '#000000'
            },
            size: 'Standard',
            price: 89.99,
            stock: 15,
            sku: 'TF-BLK-STD'
          },
          {
            color: {
              name: 'Silver',
              code: '#C0C0C0'
            },
            size: 'Standard',
            price: 99.99,
            stock: 10,
            sku: 'TF-SLV-STD'
          }
        ],
        features: [
          '3-speed settings with oscillation',
          'Remote control included',
          'LED display with timer function',
          'Energy-efficient operation',
          'Quiet performance'
        ],
        specifications: new Map([
          ['Height', '42 inches'],
          ['Base Diameter', '12 inches'],
          ['Power Consumption', '45W'],
          ['Voltage', '110-120V'],
          ['Weight', '8.5 lbs']
        ]),
        rating: 4.5,
        numReviews: 128,
        isActive: true
      },
      
      // Product 2: Ceiling Fan
      {
        name: 'Modern Ceiling Fan with LED Light',
        description: 'Contemporary ceiling fan with integrated LED light, multiple speed settings, and reversible motor for year-round comfort.',
        category: PRODUCT_CATEGORIES.FAN,
        brand: 'AirLuxe',
        images: [
          'https://example.com/images/ceilingfan1.jpg',
          'https://example.com/images/ceilingfan2.jpg'
        ],
        variants: [
          {
            color: {
              name: 'Brushed Nickel',
              code: '#C0C0C0'
            },
            size: '52 inch',
            price: 179.99,
            stock: 12,
            sku: 'CF-BN-52'
          },
          {
            color: {
              name: 'Oil-Rubbed Bronze',
              code: '#614E3F'
            },
            size: '52 inch',
            price: 179.99,
            stock: 8,
            sku: 'CF-ORB-52'
          },
          {
            color: {
              name: 'Matte White',
              code: '#F5F5F5'
            },
            size: '52 inch',
            price: 169.99,
            stock: 15,
            sku: 'CF-WHT-52'
          },
          {
            color: {
              name: 'Brushed Nickel',
              code: '#C0C0C0'
            },
            size: '44 inch',
            price: 149.99,
            stock: 10,
            sku: 'CF-BN-44'
          },
          {
            color: {
              name: 'Oil-Rubbed Bronze',
              code: '#614E3F'
            },
            size: '44 inch',
            price: 149.99,
            stock: 7,
            sku: 'CF-ORB-44'
          }
        ],
        features: [
          'Integrated LED light with dimming capability',
          'Reversible motor for summer and winter use',
          'Remote control included',
          '3 speed settings',
          'Energy Star certified'
        ],
        specifications: new Map([
          ['Blade Span', '52 or 44 inches'],
          ['Light', 'Integrated 18W LED'],
          ['Motor', 'DC Motor, reversible'],
          ['Speeds', '3 speeds'],
          ['Mounting Type', 'Downrod or flush mount'],
          ['Weight', '18-20 lbs depending on size']
        ]),
        rating: 4.7,
        numReviews: 85,
        isActive: true
      },
      
      // Product 3: Desk Fan
      {
        name: 'Compact Desk Fan',
        description: 'Portable desk fan with adjustable tilt, multiple speeds, and quiet operation - perfect for office, bedroom, or study areas.',
        category: PRODUCT_CATEGORIES.FAN,
        brand: 'BreezeWorks',
        images: [
          'https://example.com/images/deskfan1.jpg',
          'https://example.com/images/deskfan2.jpg'
        ],
        variants: [
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '8 inch',
            price: 29.99,
            stock: 50,
            sku: 'DF-WHT-8'
          },
          {
            color: {
              name: 'Black',
              code: '#000000'
            },
            size: '8 inch',
            price: 29.99,
            stock: 45,
            sku: 'DF-BLK-8'
          },
          {
            color: {
              name: 'Blue',
              code: '#1E90FF'
            },
            size: '8 inch',
            price: 34.99,
            stock: 20,
            sku: 'DF-BLU-8'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '12 inch',
            price: 39.99,
            stock: 30,
            sku: 'DF-WHT-12'
          },
          {
            color: {
              name: 'Black',
              code: '#000000'
            },
            size: '12 inch',
            price: 39.99,
            stock: 25,
            sku: 'DF-BLK-12'
          }
        ],
        features: [
          'Adjustable tilt head',
          'Quiet operation',
          '3 speed settings',
          'Compact and portable',
          'Stable base with non-slip feet'
        ],
        specifications: new Map([
          ['Blade Diameter', '8 or 12 inches'],
          ['Power', '25W (8") or 35W (12")'],
          ['Voltage', '110-120V'],
          ['Cord Length', '6 ft'],
          ['Weight', '2.5-3.8 lbs depending on size']
        ]),
        rating: 4.3,
        numReviews: 210,
        isActive: true
      },
      
      // Product 4: Window AC Unit
      {
        name: 'Window AC Unit',
        description: 'Energy-efficient window air conditioner with digital controls, multiple cooling modes, and washable filter for economical home cooling.',
        category: PRODUCT_CATEGORIES.AC,
        brand: 'CoolMaster',
        images: [
          'https://example.com/images/windowac1.jpg',
          'https://example.com/images/windowac2.jpg'
        ],
        variants: [
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '5,000 BTU',
            price: 179.99,
            stock: 15,
            sku: 'WAC-WHT-5K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '8,000 BTU',
            price: 249.99,
            stock: 20,
            sku: 'WAC-WHT-8K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '10,000 BTU',
            price: 329.99,
            stock: 12,
            sku: 'WAC-WHT-10K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '12,000 BTU',
            price: 399.99,
            stock: 8,
            sku: 'WAC-WHT-12K'
          }
        ],
        features: [
          'Digital temperature control',
          'Multiple cooling speeds',
          'Energy-saving mode',
          'Washable filter',
          'Remote control included',
          '24-hour timer'
        ],
        specifications: new Map([
          ['Cooling Capacity', '5,000-12,000 BTU'],
          ['Room Size', '150-550 sq ft (varies by model)'],
          ['Energy Efficiency Rating', '11.0-12.1 (varies by model)'],
          ['Filter Type', 'Washable antimicrobial'],
          ['Noise Level', '50-56 dB (varies by model)'],
          ['Dimensions', 'Varies by model']
        ]),
        rating: 4.2,
        numReviews: 178,
        isActive: true
      },
      
      // Product 5: Portable AC
      {
        name: 'Portable Air Conditioner with Dehumidifier',
        description: 'Versatile portable air conditioner with built-in dehumidifier and fan functions, featuring easy-roll casters and programmable timer.',
        category: PRODUCT_CATEGORIES.AC,
        brand: 'ArcticAir',
        images: [
          'https://example.com/images/portableac1.jpg',
          'https://example.com/images/portableac2.jpg',
          'https://example.com/images/portableac3.jpg'
        ],
        variants: [
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '8,000 BTU',
            price: 329.99,
            stock: 18,
            sku: 'PAC-WHT-8K'
          },
          {
            color: {
              name: 'Black',
              code: '#000000'
            },
            size: '8,000 BTU',
            price: 349.99,
            stock: 12,
            sku: 'PAC-BLK-8K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '12,000 BTU',
            price: 429.99,
            stock: 15,
            sku: 'PAC-WHT-12K'
          },
          {
            color: {
              name: 'Black',
              code: '#000000'
            },
            size: '12,000 BTU',
            price: 449.99,
            stock: 10,
            sku: 'PAC-BLK-12K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '14,000 BTU',
            price: 499.99,
            stock: 8,
            sku: 'PAC-WHT-14K'
          }
        ],
        features: [
          '3-in-1: AC, dehumidifier, and fan',
          'Self-evaporative system',
          'Digital display with remote control',
          'Programmable 24-hour timer',
          'Easy-roll casters for mobility',
          'Window kit included'
        ],
        specifications: new Map([
          ['Cooling Capacity', '8,000-14,000 BTU'],
          ['Room Size', '250-500 sq ft (varies by model)'],
          ['Dehumidification', 'Up to 2.1 pints/hour'],
          ['Fan Speeds', '3 speeds'],
          ['Noise Level', '52-56 dB (varies by model)'],
          ['Weight', '55-68 lbs (varies by model)']
        ]),
        rating: 4.1,
        numReviews: 142,
        isActive: true
      },
      
      // Product 6: Split AC System
      {
        name: 'Inverter Split Air Conditioner',
        description: 'High-efficiency split system air conditioner with inverter technology, WiFi connectivity, and ultra-quiet operation for whole-room cooling.',
        category: PRODUCT_CATEGORIES.AC,
        brand: 'ClimateComfort',
        images: [
          'https://example.com/images/splitac1.jpg',
          'https://example.com/images/splitac2.jpg'
        ],
        variants: [
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '9,000 BTU',
            price: 749.99,
            stock: 8,
            sku: 'SAC-WHT-9K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '12,000 BTU',
            price: 899.99,
            stock: 10,
            sku: 'SAC-WHT-12K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '18,000 BTU',
            price: 1199.99,
            stock: 5,
            sku: 'SAC-WHT-18K'
          },
          {
            color: {
              name: 'White',
              code: '#FFFFFF'
            },
            size: '24,000 BTU',
            price: 1499.99,
            stock: 3,
            sku: 'SAC-WHT-24K'
          }
        ],
        features: [
          'Inverter technology for energy savings',
          'WiFi connectivity for smartphone control',
          'Ultra-quiet operation',
          'Multi-stage filtration system',
          'Sleep mode for nighttime comfort',
          'Auto-restart after power outage'
        ],
        specifications: new Map([
          ['Cooling Capacity', '9,000-24,000 BTU'],
          ['SEER Rating', '20-22 (varies by model)'],
          ['Room Size', '400-1,500 sq ft (varies by model)'],
          ['Refrigerant', 'R410A'],
          ['Indoor Noise Level', '25-42 dB (varies by model)'],
          ['Warranty', '5-year parts, 7-year compressor']
        ]),
        rating: 4.8,
        numReviews: 97,
        isActive: true
      }
    ];
    
    const created = await Product.insertMany(products);
    console.log(`Products seeded: ${created.length} products created`);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [
     
      {
        name: 'Rider One',
        email: 'rider1@example.com',
        googleId: 'google_rider1_id',
        profilePicture: 'https://ui-avatars.com/api/?name=Rider+One',
        role: USER_ROLES.RIDER,
        isApproved: true,
        phone: '+1234567890'
      },
      {
        name: 'Rider Two',
        email: 'rider2@example.com',
        googleId: 'google_rider2_id',
        profilePicture: 'https://ui-avatars.com/api/?name=Rider+Two',
        role: USER_ROLES.RIDER,
        isApproved: true,
        phone: '+1234567891'
      },
      {
        name: 'Sample Customer',
        email: 'customer@example.com',
        googleId: 'google_customer_id',
        profilePicture: 'https://ui-avatars.com/api/?name=Sample+Customer',
        role: USER_ROLES.CUSTOMER,
        isApproved: true,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'ST',
          zipCode: '12345',
          country: 'USA'
        },
        phone: '+1234567892'
      },
      {
        name: 'Another Customer',
        email: 'customer2@example.com',
        googleId: 'google_customer2_id',
        profilePicture: 'https://ui-avatars.com/api/?name=Another+Customer',
        role: USER_ROLES.CUSTOMER,
        isApproved: true,
        address: {
          street: '456 Oak Ave',
          city: 'Other City',
          state: 'OT',
          zipCode: '54321',
          country: 'USA'
        },
        phone: '+1234567893'
      }
    ];

    const created = await User.insertMany(users);
    console.log(`Users seeded: ${created.length} users created`);
    }
    catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
    }
}


const run = async () => {
    await clearDatabase();
    await seedApprovedEmails();
    await seedProducts();
    // await seedUsers();
    
    console.log('Seeding completed successfully');
    mongoose.connection.close();
    }


run().catch((error) => {
    console.error('Error running script:', error);
    mongoose.connection.close();
    process.exit(1);
}
);
// Close the database connection