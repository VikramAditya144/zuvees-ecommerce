// src/pages/products/[id].js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  ArrowLeftIcon, 
  HeartIcon,
  StarIcon,
  CheckIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Notification from '../../components/common/Notification';
import { getProductById, getProducts } from '../../services/products';
import { useCart } from '../../hooks/useCart';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({
    type: '',
    message: '',
    isVisible: false,
  });
  
  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Product Id: ", id)
        const response = await getProductById(id);
        
        if (response.success) {
          setProduct(response.data);
          
          // Set default variant if available
          if (response.data.variants && response.data.variants.length > 0) {
            const defaultVariant = response.data.variants[0];
            setSelectedVariant(defaultVariant);
            setSelectedColor(defaultVariant.color.name);
            setSelectedSize(defaultVariant.size);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        showNotification('error', 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Update selected variant when color or size changes
  useEffect(() => {
    if (product && product.variants) {
      const variant = product.variants.find(
        v => v.color.name === selectedColor && v.size === selectedSize
      );
      
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [selectedColor, selectedSize, product]);
  
  // Handle quantity change
  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value));
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedVariant) {
      showNotification('error', 'Please select color and size');
      return;
    }
    
    if (selectedVariant.stock < quantity) {
      showNotification('error', 'Not enough stock available');
      return;
    }
    
    addToCart(product, selectedVariant, quantity);
    showNotification('success', 'Product added to cart');
  };
  
  // Show notification
  const showNotification = (type, message) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });
    
    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 3000);
  };
  
  // Get available colors - FIXED
  const getAvailableColors = () => {
    if (!product || !product.variants) return [];
    
    // Use a Map to get unique colors with their properties
    const colorsMap = new Map();
    product.variants.forEach(variant => {
      // Use the color name as the key to ensure uniqueness
      if (!colorsMap.has(variant.color.name)) {
        colorsMap.set(variant.color.name, variant.color);
      }
    });
    
    // Convert the map values back to an array
    return Array.from(colorsMap.values());
  };
  
  // Get available sizes - FIXED
  const getAvailableSizes = () => {
    if (!product || !product.variants) return [];
    
    // Filter sizes by selected color
    const sizes = new Set();
    product.variants
      .filter(variant => variant.color.name === selectedColor)
      .forEach(variant => {
        sizes.add(variant.size);
      });
    
    return Array.from(sizes);
  };
  
  // Check if a variant is available
  const isVariantAvailable = (colorName, size) => {
    if (!product || !product.variants) return false;
    
    const variant = product.variants.find(
      v => v.color.name === colorName && v.size === size
    );
    
    return variant && variant.stock > 0;
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <Loader size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/products')}
            icon={<ArrowLeftIcon className="w-5 h-5" />}
            iconPosition="left"
          >
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-[#660E36]">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to="/products" className="text-gray-500 hover:text-[#660E36]">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-[#660E36] font-medium">{product.name}</span>
        </nav>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="relative bg-gray-100 rounded-lg overflow-hidden h-96">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.isNew && (
                <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </span>
              )}
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-[#660E36]' : 'border border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.numReviews || 0} reviews
              </span>
            </div>
            
            <div className="text-2xl font-bold text-[#660E36] mb-6">
              ${selectedVariant ? selectedVariant.price.toFixed(2) : 'N/A'}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
                In stock ({selectedVariant ? selectedVariant.stock : 0} available)
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <TruckIcon className="w-5 h-5 text-[#660E36] mr-2" />
                Free shipping on orders over $50
              </div>
            </div>
            
            {/* Colors - FIXED */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
              <div className="flex space-x-2">
                {getAvailableColors().map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name 
                        ? 'border-[#660E36]' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                    title={color.name}
                  >
                    <span 
                      className="block w-full h-full rounded-full" 
                      style={{ backgroundColor: color.code || '#ccc' }}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sizes - FIXED */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableSizes().map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size 
                        ? 'bg-[#660E36] text-white border-[#660E36]' 
                        : isVariantAvailable(selectedColor, size)
                          ? 'border-gray-300 text-gray-700 hover:border-[#660E36]'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    }`}
                    disabled={!isVariantAvailable(selectedColor, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
              <div className="flex">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                icon={<ShoppingCartIcon className="w-5 h-5" />}
                iconPosition="left"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                fullWidth
              >
                Add to Cart
              </Button>
              
              <Button
                variant="secondary"
                onClick={()=> {navigate('/cart')}}
                icon={<CreditCardIcon className="w-5 h-5" />}
                iconPosition="left"
                fullWidth
              >
                Buy Now
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Additional Information */}
        <div className="border-t border-gray-200 pt-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start">
              <TruckIcon className="w-10 h-10 text-[#660E36] mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
                <p className="text-gray-600 text-sm">
                  Free standard shipping on all orders over $50. Expedited shipping options available at checkout.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CurrencyDollarIcon className="w-10 h-10 text-[#660E36] mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Money Back Guarantee</h3>
                <p className="text-gray-600 text-sm">
                  Not satisfied with your purchase? Return it within 30 days for a full refund.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ShieldCheckIcon className="w-10 h-10 text-[#660E36] mr-4 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Payments</h3>
                <p className="text-gray-600 text-sm">
                  All transactions are secure and encrypted. We accept all major credit cards.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-12">
          <Tabs product={product} />
        </div>
        
        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <RelatedProducts productId={product.id} />
        </div>
      </div>
      
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </MainLayout>
  );
};

// Tabs Component
const Tabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'description'
                ? 'border-[#660E36] text-[#660E36]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Description
          </button>
          
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'details'
                ? 'border-[#660E36] text-[#660E36]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Details
          </button>
          
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'reviews'
                ? 'border-[#660E36] text-[#660E36]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reviews ({product.numReviews || 0})
          </button>
        </nav>
      </div>
      
      <div className="py-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-700">
              {product.longDescription || product.description}
            </p>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Product Features</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) || (
                  <>
                    <li>Premium quality materials</li>
                    <li>Handcrafted with care</li>
                    <li>Unique and elegant design</li>
                    <li>Perfect for gifting</li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product Information</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="py-2 font-medium text-gray-600">{key}</td>
                      <td className="py-2 text-gray-700">{value}</td>
                    </tr>
                  ))}
                  {!product.specifications && (
                    <>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Material</td>
                        <td className="py-2 text-gray-700">{product.material || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Dimensions</td>
                        <td className="py-2 text-gray-700">{product.dimensions || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Weight</td>
                        <td className="py-2 text-gray-700">{product.weight || 'Not specified'}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 font-medium text-gray-600">Category</td>
                        <td className="py-2 text-gray-700">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium text-gray-600">SKU</td>
                        <td className="py-2 text-gray-700">{selectedVariant?.sku || 'Not specified'}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            {product.numReviews && product.numReviews > 0 ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Based on {product.numReviews} reviews</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* In a real app, these would come from an API */}
                  <ReviewItem 
                    name="John Doe"
                    date="2023-05-15"
                    rating={5}
                    content="I absolutely love this product! The quality is excellent and it looks even better in person."
                  />
                  <ReviewItem 
                    name="Jane Smith"
                    date="2023-04-28"
                    rating={4}
                    content="Great gift for my friend's birthday. Shipping was fast and the packaging was very elegant."
                  />
                  <ReviewItem 
                    name="Robert Johnson"
                    date="2023-04-10"
                    rating={5}
                    content="Exceeded my expectations. Will definitely order from Zuvees again in the future."
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">There are no reviews yet for this product.</p>
                <Button variant="secondary">Write a Review</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ReviewItem Component
const ReviewItem = ({ name, date, rating, content }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-[#660E36] text-white flex items-center justify-center font-semibold">
            {name.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{name}</h4>
          <div className="flex items-center mt-1 mb-2">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
};

// AnimatedCard Component
const AnimatedCard = ({ children, className }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className || ''}`}
    >
      {children}
    </motion.div>
  );
};

// RelatedProducts Component
const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        // In a real app, you'd have an API endpoint for related products
        // For now, just fetch some random products
        const response = await getProducts({ limit: 4 });
        
        // Filter out the current product
        if (response.success) {
          const filteredProducts = response.data.filter(p => p.id !== productId);
          setProducts(filteredProducts.slice(0, 4)); // Take up to 4 products
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [productId]);
  
  if (loading) {
    return <Loader />;
  }
  
  if (!products || products.length === 0) {
    return <p className="text-center text-gray-500">No related products found</p>;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <Link key={product.id} to={`/products/${product.id}`}>
          <AnimatedCard className="h-full">
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{product.category}</p>
              
              <div className="mt-auto text-[#660E36] font-bold">
                ${product.variants && product.variants.length > 0 ? 
                  product.variants[0].price.toFixed(2) : 
                  product.basePrice ? product.basePrice.toFixed(2) : 'N/A'}
              </div>
            </div>
          </AnimatedCard>
        </Link>
      ))}
    </div>
  );
};

export default ProductDetailPage;