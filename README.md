# Zuvees E-Commerce Platform

# Note: It is a basic doc advance is in repective server, client & PWA folders

A complete e-commerce solution for fans and air conditioners with multi-user roles, variant-based products, and delivery tracking.

## Live Deployments

- **Customer E-Commerce Site**: [https://zuvees-ecommerce.vercel.app/](https://zuvees-ecommerce.vercel.app/)
- **Rider PWA Application**: [https://zuvees-riders.vercel.app](https://zuvees-riders.vercel.app)
- **API Documentation**: [https://api-zuvees.onrender.com/api-docs/](https://api-zuvees.onrender.com/api-docs/)
- **GitHub Repository**: [https://github.com/VikramAditya144/zuvees-ecommerce](https://github.com/VikramAditya144/zuvees-ecommerce)

## Project Overview

Zuvees is a comprehensive e-commerce platform built for selling fans and air conditioners. The platform features:

- **Multi-user Roles**: Customer, Admin, and Rider interfaces
- **Product Variants**: Multiple size and color options for each product
- **Secure Authentication**: Google OAuth integration
- **Order Tracking**: End-to-end order management
- **PWA Support**: Progressive Web App for riders
- **Responsive Design**: Optimized for all devices

## Architecture

The project follows a modern microservices architecture with three main components:

1. **Backend API**: Node.js/Express with MongoDB
2. **Customer Frontend**: React.js with Tailwind CSS and Aceternity UI
3. **Rider PWA**: React-based Progressive Web App for delivery management

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- Google OAuth 2.0
- Swagger API Documentation

### Frontend
- React.js
- Tailwind CSS
- Aceternity UI components
- Recoil for state management
- React Query for API integration

### Rider PWA
- React.js
- Progressive Web App features
- Offline capability
- Mobile-first design
- Geolocation integration

## Features

### Customer Application
- Product browsing with filtering and search
- Color and size variant selection
- Cart and checkout flow
- Order history and tracking
- User profile management

### Admin Dashboard
- Order management overview
- Rider assignment for deliveries
- Dashboard with sales analytics
- User approval system
- Product management (CRUD)

### Rider PWA
- Order delivery management
- Status updates (Delivered/Undelivered)
- Offline capability
- Navigation assistance
- Daily delivery summaries

## Test Accounts

### Customer
- Email: customer@example.com
- Use Google Authentication

### Admin
- Email: admin@example.com
- Use Google Authentication

### Rider
- Email: rider1@example.com or rider2@example.com
- Use Google Authentication

## Local Development

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Developer Account for OAuth

### Backend Setup
```bash
# Clone repository
git clone https://github.com/VikramAditya144/zuvees-ecommerce.git

# Navigate to backend directory
cd zuvees-ecommerce/server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# Seed database
npm run seed

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd zuvees-ecommerce/client

# Install dependencies
npm install

# Start development server
npm start
```

### Rider PWA Setup
```bash
# Navigate to rider app directory
cd zuvees-ecommerce/rider-app

# Install dependencies
npm install

# Start development server
npm start
```

## Deployment

The application is deployed on the following platforms:

- **Backend**: Render
- **Frontend/Rider PWA**: Vercel
- **Database**: MongoDB Atlas

## API Documentation

Comprehensive API documentation is available via Swagger UI at the [API documentation link](https://api-zuvees.onrender.com/api-docs/).

Key API endpoints:
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/admin` - Admin operations
- `/api/rider` - Rider operations

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For inquiries, please contact [vikramaditya1533@gmail.com](mailto:vikramaditya1533@gmail.com).

---

© 2025 Zuvees E-Commerce Platform. All Rights Reserved.
