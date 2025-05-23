// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { GoogleOAuthProvider } from '@react-oauth/google';

// User Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailPage from './pages/orders/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/auth/AuthPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminRiders from './pages/admin/AdminRiders'; // New
import AdminApprovedEmails from './pages/admin/AdminApprovedEmails'; // New
import AdminSettings from './pages/admin/AdminSettings'; // New
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import ContactPage from './pages/ContactPage';

// Protected Route Component
const ProtectedRoute = ({ children, role = null }) => {
  // We'll use our useAuth hook to check authentication
  // but for simplicity, let's mock it here
  const isAuthenticated = localStorage.getItem('zuvees-auth') !== null;
  const user = JSON.parse(localStorage.getItem('zuvees-auth') || '{}')?.authState?.user;
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Check if user has the required role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RecoilRoot>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Protected Customer Routes */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:id" 
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <ProtectedRoute role="admin">
                  <AdminProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/new" 
              element={
                <ProtectedRoute role="admin">
                  <AdminProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/products/edit/:id" 
              element={
                <ProtectedRoute role="admin">
                  <AdminProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <ProtectedRoute role="admin">
                  <AdminOrders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/orders/:id" 
              element={
                <ProtectedRoute role="admin">
                  <AdminOrderDetail />
                </ProtectedRoute>
              } 
            />
            {/* New Admin Routes */}
            <Route 
              path="/admin/riders" 
              element={
                <ProtectedRoute role="admin">
                  <AdminRiders />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/approved-emails" 
              element={
                <ProtectedRoute role="admin">
                  <AdminApprovedEmails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute role="admin">
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch All Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </GoogleOAuthProvider>
  );
};

export default App;