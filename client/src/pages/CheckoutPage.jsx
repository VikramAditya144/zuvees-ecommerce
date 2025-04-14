// src/pages/checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LockClosedIcon,
  CheckIcon,
  ChevronRightIcon,
  CreditCardIcon,
  TruckIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../components/layouts/MainLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { createOrder } from '../services/orders';

const steps = [
  { id: 'contact', name: 'Contact', icon: <UserIcon className="w-5 h-5" /> },
  { id: 'shipping', name: 'Shipping', icon: <TruckIcon className="w-5 h-5" /> },
  { id: 'payment', name: 'Payment', icon: <CreditCardIcon className="w-5 h-5" /> },
];

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    // Contact info
    name: '',
    email: '',
    phone: '',
    
    // Shipping address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    
    // Payment
    paymentMethod: 'credit_card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });
  
  // Form errors
  const [errors, setErrors] = useState({});
  
  // Prefill user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        ...((user.address && typeof user.address === 'object') && {
          address: user.address.street || prev.address,
          city: user.address.city || prev.city,
          state: user.address.state || prev.state,
          zipCode: user.address.zipCode || prev.zipCode,
          country: user.address.country || prev.country,
        })
      }));
    }
  }, [isAuthenticated, user]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate, orderSuccess]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Validate form based on current step
  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 'contact') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }
    else if (currentStep === 'shipping') {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }
    else if (currentStep === 'payment') {
      if (formData.paymentMethod === 'credit_card') {
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
        if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Move to next step
  const nextStep = () => {
    if (!validateStep()) return;
    
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!validateStep()) return;
    
    try {
      setLoading(true);
      
      // Prepare order data
      const orderData = {
        orderItems: cart.items.map(item => ({
          product: item.product.id,
          variant: item.variant.id,
          quantity: item.quantity
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      };
      
      // Send order to the server
      const response = await createOrder(orderData);
      
      if (response.success) {
        setOrderNumber(response.data.orderNumber || response.data._id);
        setOrderSuccess(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors({ form: 'An error occurred while processing your order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  // Render order success screen
  if (orderSuccess) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <CheckIcon className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
            <p className="text-gray-600 mb-8">
              Your order #{orderNumber} has been placed successfully. You'll receive a confirmation email shortly.
            </p>
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/orders')}
            >
              View Your Orders
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Checkout Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, stepIdx) => (
                <div key={step.id} className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Only allow going back to previous steps
                      const currentIdx = steps.findIndex(s => s.id === currentStep);
                      const targetIdx = steps.findIndex(s => s.id === step.id);
                      if (targetIdx <= currentIdx) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className={`flex flex-col items-center justify-center w-full ${
                      step.id === currentStep 
                        ? 'text-[#660E36]' 
                        : steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id)
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 mb-2 ${
                      step.id === currentStep 
                        ? 'border-[#660E36] bg-pink-50' 
                        : steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id)
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300'
                    }`}>
                      {steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id) ? (
                        <CheckIcon className="w-6 h-6 text-green-600" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{step.name}</span>
                  </motion.button>
                  
                  {stepIdx < steps.length - 1 && (
                    <div className="hidden sm:block h-0.5 w-full bg-gray-200 relative">
                      {steps.findIndex(s => s.id === currentStep) > stepIdx && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="absolute h-0.5 bg-green-600"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Contact Information */}
                {currentStep === 'contact' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                    
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        error={errors.name}
                        required
                      />
                      
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        error={errors.email}
                        required
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        error={errors.phone}
                        required
                      />
                    </div>
                  </div>
                )}
                
                {/* Shipping Address */}
                {currentStep === 'shipping' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                    
                    <div className="space-y-4">
                      <Input
                        label="Street Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your street address"
                        error={errors.address}
                        required
                      />
                      
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        error={errors.city}
                        required
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="State / Province"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Enter your state"
                          error={errors.state}
                          required
                        />
                        
                        <Input
                          label="ZIP / Postal Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="Enter your ZIP code"
                          error={errors.zipCode}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Information */}
                {currentStep === 'payment' && (
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id="credit_card"
                              name="paymentMethod"
                              type="radio"
                              value="credit_card"
                              checked={formData.paymentMethod === 'credit_card'}
                              onChange={handleChange}
                              className="h-4 w-4 text-[#660E36] focus:ring-[#660E36] border-gray-300"
                            />
                            <label htmlFor="credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                              Credit Card
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="paypal"
                              name="paymentMethod"
                              type="radio"
                              value="paypal"
                              checked={formData.paymentMethod === 'paypal'}
                              onChange={handleChange}
                              className="h-4 w-4 text-[#660E36] focus:ring-[#660E36] border-gray-300"
                            />
                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                              PayPal
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {formData.paymentMethod === 'credit_card' && (
                        <div className="space-y-4">
                          <Input
                            label="Name on Card"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            placeholder="Enter name as it appears on your card"
                            error={errors.cardName}
                            required
                          />
                          
                          <Input
                            label="Card Number"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="Enter your card number"
                            error={errors.cardNumber}
                            required
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Expiry Date (MM/YY)"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              error={errors.cardExpiry}
                              required
                            />
                            
                            <Input
                              label="CVV"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              placeholder="Enter CVV"
                              error={errors.cardCvv}
                              required
                            />
                          </div>
                        </div>
                      )}
                      
                      {formData.paymentMethod === 'paypal' && (
                        <div className="bg-blue-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            You'll be redirected to PayPal to complete your payment after placing your order.
                          </p>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center">
                          <LockClosedIcon className="h-5 w-5 text-green-500 mr-2" />
                          <p className="text-sm text-gray-600">
                            Your payment information is secured with SSL encryption.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Form Errors */}
                {errors.form && (
                  <div className="px-6 pb-6">
                    <div className="bg-red-50 text-red-700 p-3 rounded-md">
                      {errors.form}
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      onClick={currentStep === 'contact' ? () => navigate('/cart') : prevStep}
                    >
                      {currentStep === 'contact' ? 'Back to Cart' : 'Previous Step'}
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={currentStep === 'payment' ? handleSubmitOrder : nextStep}
                      disabled={loading}
                      icon={currentStep === 'payment' ? null : <ChevronRightIcon className="w-5 h-5" />}
                      iconPosition="right"
                    >
                      {currentStep === 'payment' ? 'Place Order' : 'Continue'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="max-h-80 overflow-y-auto mb-4">
                    <ul className="space-y-4">
                      {cart.items.map((item) => (
                        <li key={`${item.product._id}-${item.variant._id}`} className="flex">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800">{item.product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {item.variant.color.name}, {item.variant.size}
                            </p>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                              <span className="text-sm font-medium">${(item.variant.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border-t border-gray-200 py-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${(cart.totalPrice * 0.07).toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#660E36]">
                          ${(cart.totalPrice + (cart.totalPrice * 0.07)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Total Items: {cart.totalItems}</p>
                      <p>Estimated Delivery: 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;