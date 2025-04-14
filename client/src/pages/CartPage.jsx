// src/pages/cart.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  XMarkIcon,
  ShoppingBagIcon, 
  ArrowLeftIcon,
  TrashIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  
  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      setPromoSuccess('');
      return;
    }
    
    // In a real app, you'd validate this with an API
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoSuccess('Promo code applied successfully! 10% discount');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoSuccess('');
    }
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/auth', { state: { redirectTo: '/checkout' } });
    }
  };
  
  if (cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center">
                <ShoppingBagIcon className="w-12 h-12 text-[#660E36]" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Browse our collection to find the perfect gift.
            </p>
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/products')}
              icon={<ArrowLeftIcon className="w-5 h-5" />}
              iconPosition="left"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            Review your items before proceeding to checkout.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <motion.li
                    key={`${item.product._id}-${item.variant._id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0 sm:mr-6">
                        <img
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <Link to={`/products/${item.product._id}`} className="text-lg font-medium text-gray-800 hover:text-[#660E36]">
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product._id, item.variant._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                          <div className="text-sm text-gray-600">
                            Color: <span className="font-medium">{item.variant.color.name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Size: <span className="font-medium">{item.variant.size}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.variant._id, item.quantity - 1)}
                              className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, item.variant._id, parseInt(e.target.value) || 1)}
                              className="w-10 h-8 border-t border-b border-gray-300 text-center text-sm"
                            />
                            <button
                              onClick={() => updateQuantity(item.product._id, item.variant._id, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-[#660E36] font-bold">
                            ${(item.variant.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
              
              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/products')}
                    icon={<ArrowLeftIcon className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Continue Shopping
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/products')}
                    icon={<TrashIcon className="w-4 h-4" />}
                    iconPosition="left"
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  
                  {promoSuccess && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${(cart.totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-[#660E36]">
                        ${promoSuccess ? (cart.totalPrice * 0.9).toFixed(2) : cart.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-[#660E36] focus:border-[#660E36]"
                    />
                    <Button
                      variant="secondary"
                      className="rounded-l-none"
                      onClick={applyPromoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoError && <p className="mt-1 text-sm text-red-600">{promoError}</p>}
                  {promoSuccess && <p className="mt-1 text-sm text-green-600">{promoSuccess}</p>}
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCheckout}
                  fullWidth
                  icon={<GiftIcon className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Proceed to Checkout
                </Button>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Need help? Contact our customer support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
        </MainLayout>
    );
}
export default CartPage;