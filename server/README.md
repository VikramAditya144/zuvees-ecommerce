# E-Commerce Platform Backend for Fans & ACs

Backend API for a full-stack e-commerce application selling fans and air conditioners with multiple variants.

## Features

- **User Authentication**: Google OAuth integration with role-based access control
- **Product Management**: Comprehensive product catalog with variants for color and size
- **Order Processing**: Complete order lifecycle management
- **Admin Dashboard**: Order management and rider assignment
- **Rider System**: Delivery tracking and status updates

## Tech Stack

- **Node.js & Express**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: Elegant MongoDB object modeling
- **JWT**: Secure authentication mechanism
- **Google OAuth**: User authentication via Google

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Google Developer Account (for OAuth)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd ecommerce-fans-ac/server
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   ```
   - Edit `.env` file with your configuration
   - Add MongoDB connection string
   - Add Google OAuth credentials

4. Seed the database with initial data
   ```
   node src/utils/seed.js
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. The server will be running at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/google`: Login with Google
- `GET /api/auth/me`: Get current user profile

### Products

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get single product
- `POST /api/products`: Create product (Admin)
- `PUT /api/products/:id`: Update product (Admin)
- `DELETE /api/products/:id`: Delete product (Admin)

### Orders

- `POST /api/orders`: Create new order
- `GET /api/orders`: Get user's orders
- `GET /api/orders/:id`: Get order details
- `PATCH /api/orders/:id/status`: Update order status
- `PATCH /api/orders/:id/cancel`: Cancel order

### Admin

- `GET /api/admin/orders`: Get all orders
- `PATCH /api/admin/orders/:id/status`: Update order status
- `PATCH /api/admin/orders/:id/assign`: Assign rider to order
- `GET /api/admin/approved-emails`: Get all approved emails
- `POST /api/admin/approved-emails`: Add approved email
- `DELETE /api/admin/approved-emails/:id`: Remove approved email
- `GET /api/admin/dashboard`: Get dashboard stats

### Rider

- `GET /api/rider/orders`: Get assigned orders
- `PATCH /api/rider/orders/:id/status`: Update order status
- `GET /api/rider/dashboard`: Get rider dashboard stats

## Demo Accounts

The seed script creates the following accounts for testing:

- **Admin**: admin@example.com
- **Riders**: rider1@example.com, rider2@example.com
- **Customers**: customer@example.com, customer2@example.com

## License

This project is licensed under the MIT License.