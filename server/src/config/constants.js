module.exports = {
    // User roles
    USER_ROLES: {
      CUSTOMER: 'customer',
      ADMIN: 'admin',
      RIDER: 'rider'
    },
    
    // Order statuses
    ORDER_STATUS: {
      PENDING: 'pending',
      PAID: 'paid',
      SHIPPED: 'shipped',
      DELIVERED: 'delivered',
      UNDELIVERED: 'undelivered',
      CANCELLED: 'cancelled'
    },
    
    // Product categories
    PRODUCT_CATEGORIES: {
      FAN: 'fan',
      AC: 'air-conditioner'
    },
    
    // JWT expiration time
    JWT_EXPIRATION: '30d',
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10
  };