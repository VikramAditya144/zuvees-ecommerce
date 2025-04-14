# Fans & ACs E-Commerce Backend API


# API DOCS: https://api-zuvees.onrender.com/api-docs/

A robust RESTful API built with Node.js, Express, and MongoDB to power the Fans & ACs E-Commerce platform. This backend provides comprehensive functionality for product management, order processing, user authentication, and delivery management.

## Features

- **Authentication**: Google OAuth integration with role-based access control
- **Product Management**: Complete CRUD operations for products with variant support
- **Order Processing**: End-to-end order lifecycle management
- **User Management**: User profiles with address management
- **Admin Dashboard**: Order monitoring and rider assignment
- **Rider System**: Order delivery tracking and status updates
- **API Documentation**: Swagger integration for easy API testing and documentation

## Tech Stack

- **Node.js**: JavaScript runtime environment
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Google OAuth**: User authentication via Google
- **Swagger**: API documentation and testing
- **Morgan**: HTTP request logger
- **bcrypt.js**: Password hashing
- **cors**: Cross-Origin Resource Sharing
- **dotenv**: Environment variable management

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── db.js               # Database connection
│   ├── constants.js        # Application constants
│   ├── google-oauth.js     # Google OAuth setup
│   └── swagger.js          # Swagger configuration
├── controllers/            # Request handlers
│   ├── authController.js   # Authentication logic
│   ├── productController.js # Product CRUD operations
│   ├── orderController.js  # Order management
│   ├── userController.js   # User profile management
│   ├── adminController.js  # Admin operations
│   └── riderController.js  # Rider operations
├── middleware/             # Custom middleware
│   ├── auth.js             # Authentication middleware
│   ├── roles.js            # Role-based access control
│   ├── validateRequest.js  # Request validation
│   └── errorHandler.js     # Global error handling
├── models/                 # Database schemas
│   ├── User.js             # User model with roles
│   ├── Product.js          # Product model with variants
│   ├── Order.js            # Order model with status tracking
│   ├── Rider.js            # Optional Rider model
│   └── ApprovedEmail.js    # Approved emails for auth
├── routes/                 # API route definitions
│   ├── authRoutes.js       # Authentication endpoints
│   ├── productRoutes.js    # Product endpoints
│   ├── orderRoutes.js      # Order endpoints
│   ├── userRoutes.js       # User profile endpoints
│   ├── adminRoutes.js      # Admin endpoints
│   ├── riderRoutes.js      # Rider endpoints
│   └── swaggerRoutes.js    # Swagger documentation routes
├── services/               # External service integrations
│   ├── googleService.js    # Google API integration
│   └── emailService.js     # Email service (stub)
├── swagger/                # Swagger documentation
│   ├── components.js       # Schema definitions
│   ├── authRoutes.js       # Auth endpoints documentation
│   ├── productRoutes.js    # Product endpoints documentation
│   ├── orderRoutes.js      # Order endpoints documentation
│   ├── adminRoutes.js      # Admin endpoints documentation
│   └── riderRoutes.js      # Rider endpoints documentation
├── utils/                  # Utility functions
│   ├── helpers.js          # General helper functions
│   ├── validators.js       # Request validation helpers
│   ├── errorResponse.js    # Error response formatter
│   ├── seed.js             # Database seeding script
│   └── seedApprovedEmails.js # Approved emails seeding
├── app.js                  # Express app setup
└── templates/              # HTML templates
    └── auth.html           # Google authentication test page
```

## Installation and Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Developer Account (for OAuth)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VikramAditya144/zuvees-ecommerce.git
   cd zuvees-ecommerce
   cd server

   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/ecommerce-fans-ac
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   FRONTEND_URL=http://localhost:3000
   ADMIN_URL=http://localhost:3001
   RIDER_APP_URL=http://localhost:3002
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

6. Access the API documentation:
   ```
   http://localhost:4000/api-docs
   ```

## API Endpoints

### Authentication

- `POST /api/auth/google`: Login with Google
- `GET /api/auth/me`: Get current user profile
- `POST /api/auth/check-approval`: Check if email is approved

### Products

- `GET /api/products`: Get all products with filtering and pagination
- `GET /api/products/:id`: Get single product details
- `POST /api/products`: Create new product (Admin only)
- `PUT /api/products/:id`: Update product (Admin only)
- `DELETE /api/products/:id`: Delete product (Admin only)

### Orders

- `POST /api/orders`: Create a new order
- `GET /api/orders`: Get current user's orders
- `GET /api/orders/:id`: Get order details
- `PATCH /api/orders/:id/status`: Update order status
- `PATCH /api/orders/:id/cancel`: Cancel an order

### Users

- `PATCH /api/users/profile`: Update user profile
- `GET /api/users/riders`: Get all riders (Admin only)
- `POST /api/users/check-email`: Check if email exists

### Admin

- `GET /api/admin/orders`: Get all orders
- `PATCH /api/admin/orders/:id/status`: Update order status
- `PATCH /api/admin/orders/:id/assign`: Assign rider to order
- `GET /api/admin/approved-emails`: Get all approved emails
- `POST /api/admin/approved-emails`: Add approved email
- `DELETE /api/admin/approved-emails/:id`: Remove approved email
- `GET /api/admin/dashboard`: Get dashboard statistics

### Rider

- `GET /api/rider/orders`: Get assigned orders
- `GET /api/rider/orders/:id`: Get order details
- `PATCH /api/rider/orders/:id/status`: Update order status
- `GET /api/rider/dashboard`: Get rider dashboard statistics

## Data Models

### User

- Multiple roles: customer, admin, rider
- Google authentication integration
- Address management
- Role-based permissions

### Product

- Support for color and size variants
- Comprehensive product details
- Stock management
- Rating and reviews

### Order

- Complete order lifecycle
- Order items with variant tracking
- Status tracking
- Assignment to riders

### ApprovedEmail

- Email whitelist for approved users
- Role-specific approval
- Used for access control

## Authentication and Authorization

The API uses Google OAuth for authentication and JWT for maintaining sessions:

1. User authenticates via Google
2. Backend verifies the Google ID token
3. Checks if user's email is pre-approved
4. Issues a JWT token for subsequent requests
5. Role-based middleware controls access to protected routes

## Testing the API

### Swagger UI

The API includes Swagger documentation for easy testing:

1. Navigate to `http://localhost:4000/api-docs` in your browser
2. Authorize using the JWT token obtained from Google authentication
3. Test endpoints directly from the Swagger UI

### Google Authentication Testing

A simple HTML page is provided for testing Google authentication:

1. Navigate to `http://localhost:4000/auth`
2. Click the Google Sign-In button
3. Complete the Google authentication flow
4. The page will display the JWT token upon successful authentication

## Database Seeding

The API includes scripts to seed the database with test data:

```bash
# Seed entire database (products, users, approved emails)
npm run seed

# Seed only approved emails
npm run seed:emails
```

This creates:
- Test users (admin, riders, customers)
- Product catalog with variants
- Approved emails for testing

## Error Handling

The API implements a consistent error handling approach:

- Standardized error response format
- HTTP status codes aligned with error types
- Detailed validation error messages
- Centralized error handling middleware

## Security Considerations

- JWT tokens for authentication
- Role-based access control
- Input validation and sanitization
- Environment variable management
- CORS configuration for frontend domains

## Development

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm run seed`: Seed the database with test data
- `npm run seed:emails`: Seed approved emails only

### Development Guidelines

- Use the ESLint configuration for code linting
- Follow the established project structure
- Document all new endpoints with Swagger
- Implement proper error handling
- Write modular, reusable code

## Deployment

### Production Setup

1. Set environment variables for production
2. Build the project (if using TypeScript or transpilation)
3. Start the server with `npm start`

### Environment Variables for Production

```
PORT=8080
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://admin.your-frontend-domain.com
RIDER_APP_URL=https://rider.your-frontend-domain.com
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**:
   - Check your MongoDB URI
   - Ensure MongoDB is running
   - Verify network access

2. **Google OAuth Issues**:
   - Verify credentials in Google Developer Console
   - Check authorized domains and redirect URIs
   - Ensure client ID matches between frontend and backend

3. **JWT Authentication Failures**:
   - Check JWT secret
   - Verify token expiration
   - Check for token format issues

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For technical support, please contact [vikramaditya1533@gmail.com](mailto:vikramaditya1533@gmail.com).
