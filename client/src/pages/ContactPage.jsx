import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit the form data to an API
    console.log('Form submitted:', formData);
    
    // Simulate successful submission
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message. We will get back to you shortly!'
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#660E36] to-[#8c1349] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Get In <span className="text-yellow-300">Touch</span> With Us
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              Have questions about our products or services? We're here to help you find the perfect solution for your needs.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+91 123 456 7890</p>
              <p className="text-gray-600">+91 987 654 3210</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <EnvelopeIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">support@zuvees.com</p>
              <p className="text-gray-600">info@zuvees.com</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <ClockIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9AM - 6PM</p>
              <p className="text-gray-600">Saturday: 10AM - 4PM</p>
            </motion.div>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Map Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/2 h-96"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9763164756794!2d77.69747617485744!3d12.972424214790563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1329c73049b1%3A0x81a90bb5c5bd427c!2sMarathahalli%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1688985432568!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Zuvees Location"
              ></iframe>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:w-1/2 p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              {formStatus.submitted && (
                <div className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input
                      label="Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Input
                      label="Phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <Input
                      label="Subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Subject of your message"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#660E36] focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Find answers to common questions about our products, shipping, and policies.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              <FAQ
                question="What are your delivery options?"
                answer="We offer standard delivery (3-5 business days), express delivery (1-2 business days), and same-day delivery in select areas. All orders over ₹1,000 qualify for free standard shipping."
              />
              
              <FAQ
                question="How can I track my order?"
                answer="Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
              />
              
              <FAQ
                question="What is your return policy?"
                answer="We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Please contact our customer service team to initiate a return."
              />
              
              <FAQ
                question="Do you offer installation services for air conditioners?"
                answer="Yes, we provide professional installation services for all our air conditioners. The installation fee will be calculated at checkout based on your location and the type of unit."
              />
              
              <FAQ
                question="How do I know which fan or AC is right for my room size?"
                answer="We provide room size recommendations for all our products. As a general rule, you need approximately 1 ton of cooling capacity for every 100 square feet of room area. For fans, consider the CFM (cubic feet per minute) rating which should match your room's requirements."
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Support CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#660E36] to-[#8c1349] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white text-[#660E36] rounded-full mb-6">
                <ChatBubbleLeftRightIcon className="w-10 h-10" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Immediate Assistance?</h2>
              <p className="text-xl text-gray-200 mb-8">
                Our customer support team is available to help you with any questions or concerns.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<PhoneIcon className="w-5 h-5" />}
                  iconPosition="left"
                  onClick={() => window.location.href = 'tel:+911234567890'}
                >
                  Call Support
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="border border-white text-white hover:bg-white hover:text-[#660E36]"
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                  iconPosition="left"
                  onClick={() => window.location.href = 'mailto:support@zuvees.com'}
                >
                  Email Support
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Store Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Visit Our Stores</h2>
            <p className="text-gray-600">
              Experience our products in person at one of our showrooms across India.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <StoreLocation
              city="Bangalore"
              address="123 Electronic City, Phase 1, Bangalore - 560100"
              phone="+91 80 1234 5678"
              timing="10:00 AM - 8:00 PM"
            />
            
            <StoreLocation
              city="Mumbai"
              address="456 Link Road, Andheri West, Mumbai - 400053"
              phone="+91 22 9876 5432"
              timing="9:30 AM - 7:30 PM"
            />
            
            <StoreLocation
              city="Delhi"
              address="789 Connaught Place, New Delhi - 110001"
              phone="+91 11 2345 6789"
              timing="10:00 AM - 8:00 PM"
            />
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

// FAQ Component
const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      variants={fadeInUp}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-[#660E36] focus:ring-inset"
      >
        <h3 className="text-lg font-medium text-gray-800">{question}</h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 p-4 border-t' : 'max-h-0'}`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </motion.div>
  );
};

// Store Location Component
const StoreLocation = ({ city, address, phone, timing }) => {
  return (
    <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
        <MapPinIcon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-semibold mb-4">{city} Store</h3>
      
      <div className="space-y-3 text-gray-600">
        <p>
          <span className="font-medium block">Address:</span>
          {address}
        </p>
        <p>
          <span className="font-medium block">Phone:</span>
          {phone}
        </p>
        <p>
          <span className="font-medium block">Business Hours:</span>
          {timing}
        </p>
      </div>
    </motion.div>
  );
};

export default ContactPage;