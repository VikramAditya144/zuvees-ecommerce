// src/pages/index.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  GiftIcon, 
  TruckIcon, 
  SparklesIcon,
  ShoppingCartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../components/layouts/MainLayout';
import Button from '../components/common/Button';
import AnimatedCard from '../components/common/AnimatedCard';
import { getProducts } from '../services/products';

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

const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const response = await getProducts({ limit: 4 });
        setFeaturedProducts(response.data);
        
        // Set some sample categories (in a real app, these would come from the API)
        setCategories([
          { id: 1, name: 'Birthday Gifts', image: '/assets/images/categories/birthday.jpg' },
          { id: 2, name: 'Anniversary', image: '/assets/images/categories/anniversary.jpg' },
          { id: 3, name: 'Corporate Gifts', image: '/assets/images/categories/corporate.jpg' },
          { id: 4, name: 'Personalized', image: '/assets/images/categories/personalized.jpg' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#660E36] to-[#8c1349] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-8 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Gifts That Create <span className="text-yellow-300">Lasting Memories</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                Discover extraordinary gifts for every occasion that will surprise and delight your loved ones.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {}}
                >
                  Explore Gifts
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white text-white hover:bg-white hover:text-[#660E36]"
                  onClick={() => {}}
                >
                  How It Works
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2 relative"
            >
              <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg shadow-xl">
                <img
                  src="/assets/images/hero-image.jpg"
                  alt="Gift box with decorative ribbon"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.5,
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      repeatDelay: 2
                    }}
                    className="bg-white bg-opacity-90 text-[#660E36] font-bold px-6 py-3 rounded-full text-xl"
                  >
                    New Collections!
                  </motion.div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="absolute -bottom-6 -right-6 bg-yellow-500 text-[#660E36] font-bold px-6 py-3 rounded-full shadow-lg transform rotate-6"
              >
                Free Shipping!
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <GiftIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Selections</h3>
              <p className="text-gray-600">Curated gifts that stand out and make every occasion special.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <TruckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Express shipping to ensure your gifts arrive right on time.</p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 text-[#660E36] rounded-full mb-4">
                <SparklesIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Elegant Packaging</h3>
              <p className="text-gray-600">Beautiful presentation that enhances the gifting experience.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore By Occasion</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect gift for every celebration and special moment in life.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                className="relative group overflow-hidden rounded-lg shadow-md h-64"
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl text-white font-bold mb-2">{category.name}</h3>
                    <Link 
                      to={`/products?category=${category.id}`}
                      className="inline-flex items-center text-white bg-[#660E36] bg-opacity-90 hover:bg-opacity-100 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                    >
                      Explore
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Gifts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular and trending gift selections that are sure to impress.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
              >
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} index={index} />
                ))}
              </motion.div>
              
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to="/products">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={<ArrowRightIcon className="w-5 h-5" />}
                      iconPosition="right"
                    >
                      View All Products
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied customers about their gifting experiences.
            </p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <TestimonialCard
              name="Sarah Johnson"
              role="Regular Customer"
              image="/assets/images/testimonials/person1.jpg"
              content="The birthday gift I ordered for my sister was absolutely perfect! The packaging was elegant and the delivery was right on time. I'll definitely be ordering from Zuvees again."
            />
            
            <TestimonialCard
              name="Michael Thompson"
              role="Corporate Client"
              image="/assets/images/testimonials/person2.jpg"
              content="We ordered corporate gifts for our entire team during the holidays and everyone loved them. The personalization options made each gift feel special and thoughtful."
            />
            
            <TestimonialCard
              name="Emily Chen"
              role="First-time Customer"
              image="/assets/images/testimonials/person3.jpg"
              content="I was skeptical about ordering gifts online, but Zuvees exceeded my expectations. The quality of the products is amazing and the customer service was outstanding."
            />
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-[#660E36] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-gray-200 mb-8">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-md focus:outline-none text-gray-800"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

// ProductCard Component
const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Link to={`/products/${product._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2 truncate">{product.category}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-[#660E36] font-bold">
              ${product.variants[0].price.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              className="text-sm"
              icon={<ShoppingCartIcon className="w-4 h-4" />}
              iconPosition="left"
            >
              Add
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// TestimonialCard Component
const TestimonialCard = ({ name, role, image, content }) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">"{content}"</p>
      <div className="flex mt-4">
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <StarIcon className="w-5 h-5 text-yellow-400" />
        <StarIcon className="w-5 h-5 text-yellow-400" />
      </div>
    </motion.div>
  );
};

export default HomePage;