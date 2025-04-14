# Fans & ACs E-Commerce Frontend

# Link: https://zuvees-ecommerce.vercel.app/


A modern, responsive e-commerce platform built with React.js, Tailwind CSS, and Aceternity UI components for selling fans and air conditioners with an engaging user experience.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Product Browsing**: Intuitive product listings with filtering and search capabilities
- **Product Variants**: Support for multiple color and size variants for each product
- **Shopping Cart**: Interactive cart with persistent storage
- **User Authentication**: Secure Google OAuth integration with role-based access
- **Order Management**: Track orders and order history
- **User Profile**: Manage personal information and addresses
- **Animations & Effects**: Smooth transitions and micro-interactions using Aceternity UI

## Tech Stack

- **React 18**: Modern functional components with hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Aceternity UI**: Advanced UI components with animations
- **Recoil**: State management
- **React Query**: Data fetching, caching, and synchronization
- **Axios**: HTTP client for API requests
- **React Router**: Navigation and routing
- **Google OAuth**: User authentication
- **ESLint/Prettier**: Code quality and formatting

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/              # Layout components (Navbar, Footer, etc.)
│   ├── products/            # Product-related components
│   ├── cart/                # Shopping cart components
│   ├── checkout/            # Checkout process components
│   ├── user/                # User account components
│   └── ui/                  # UI elements (buttons, inputs, etc.)
├── pages/                   # Page components
│   ├── Home.jsx             # Home page
│   ├── Products.jsx         # Products listing page
│   ├── ProductDetail.jsx    # Single product detail page
│   ├── Cart.jsx             # Cart page
│   ├── Checkout.jsx         # Checkout process page
│   ├── Orders.jsx           # Order history page
│   ├── Profile.jsx          # User profile page
│   └── NotFound.jsx         # 404 page
├── hooks/                   # Custom React hooks
├── store/                   # Recoil atoms and selectors
├── services/                # API service calls
├── utils/                   # Utility functions
├── contexts/                # React contexts
├── assets/                  # Static assets (images, icons, etc.)
├── styles/                  # Global styles
├── App.jsx                  # Main App component
└── index.jsx                # Entry point
```

## Installation and Setup

### Prerequisites

- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/VikramAditya144/zuvees-ecommerce.git
   cd zuvees-ecommerce
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:4000/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features in Detail

### Product Catalog

- **Product Listings**: Grid and list view options with pagination
- **Filtering System**: Filter by category, price range, brand, and features
- **Search Functionality**: Real-time search with debounced input
- **Sort Options**: Sort by price, popularity, and newest arrivals

### Product Details

- **Variant Selection**: Interactive color and size selection with visual feedback
- **Image Gallery**: Multiple product images with zoom functionality
- **Specifications**: Detailed product specifications in an organized format
- **Reviews**: Customer reviews with ratings

### Shopping Experience

- **Cart Management**: Add, update quantity, and remove items
- **Saved Items**: Save products for later
- **Persistent Cart**: Cart data persists across sessions
- **Quick Add**: Add products to cart from listing pages

### User Account

- **Google Sign-In**: Seamless authentication with Google
- **Order History**: View past orders with details and status
- **Address Management**: Add, edit, and delete shipping addresses
- **Profile Settings**: Update personal information

### Checkout Process

- **Multi-step Checkout**: Step-by-step checkout process
- **Address Selection**: Choose from saved addresses or add new ones
- **Order Summary**: Clear breakdown of order details and costs
- **Order Confirmation**: Confirmation page with order details

## API Integration

The frontend communicates with the backend through a comprehensive REST API:

- **Authentication**: `/api/auth/google`, `/api/auth/me`
- **Products**: `/api/products`, `/api/products/:id`
- **Orders**: `/api/orders`, `/api/orders/:id`, `/api/orders/:id/status`
- **User Profile**: `/api/users/profile`

## Responsive Design

The application uses a mobile-first approach with responsive design principles:

- **Mobile (< 640px)**: Optimized for small screens with simplified navigation
- **Tablet (640px - 1024px)**: Enhanced layout with more content visibility
- **Desktop (> 1024px)**: Full experience with all features and rich interactions

## UI/UX Features

- **Micro-interactions**: Subtle animations for user actions
- **Skeleton Loading**: Visual placeholders during content loading
- **Toast Notifications**: Non-intrusive feedback for user actions
- **Themed Components**: Consistent styling with attention to detail
- **Accessibility**: WCAG compliance for inclusive user experience

## Performance Optimization

- **Code Splitting**: Lazy loading of components for faster initial load
- **Image Optimization**: Proper sizing and lazy loading of images
- **Memoization**: Preventing unnecessary re-renders
- **Caching**: Intelligent caching of API responses with React Query

## Development Guidelines

### Code Style

We follow a consistent code style enforced by ESLint and Prettier:

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Component Development

- Use functional components with hooks
- Create components with single responsibility
- Document complex components with JSDoc comments
- Use prop-types for better type checking

### State Management

- Use Recoil for global state management
- Use React Query for server state
- Use local state for component-specific state

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For inquiries, please contact [vikramaditya1533@gmail.com](mailto:vikramaditya1533@gmail.com).
