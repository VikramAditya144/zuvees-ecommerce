// src/pages/admin/product-form.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

import AdminLayout from '../../components/layouts/AdminLayout';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { getProductById, createProduct, updateProduct } from '../../services/products';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    images: [],
    variants: [
      {
        color: { name: '', code: '#000000' },
        size: '',
        price: 0,
        stock: 0,
        sku: '' // Added missing sku field
      }
    ],
    isActive: true
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Available categories (in a real app, these would come from an API)
  const categories = [
    'fan',
    'air-conditioner'
  ];
  
  // Available sizes (in a real app, these would be dynamic based on product type)
  const sizes = ['S', 'M', 'L', 'XL', 'One Size'];
  
  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await getProductById(id);
          
          if (response.success) {
            setFormData(response.data);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          alert('Failed to load product data. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditMode]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updatedVariants = [...prev.variants];
      
      if (field.includes('.')) {
        // Handle nested fields like 'color.name'
        const [parent, child] = field.split('.');
        updatedVariants[index] = {
          ...updatedVariants[index],
          [parent]: {
            ...updatedVariants[index][parent],
            [child]: value
          }
        };
      } else {
        updatedVariants[index] = {
          ...updatedVariants[index],
          [field]: field === 'price' || field === 'stock' ? Number(value) : value
        };
      }
      
      return { ...prev, variants: updatedVariants };
    });
    
    // Clear error
    if (errors[`variants[${index}].${field}`]) {
      setErrors(prev => ({ ...prev, [`variants[${index}].${field}`]: '' }));
    }
  };
  
  // Add new variant
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: { name: '', code: '#000000' },
          size: '',
          price: 0,
          stock: 0,
          sku: '' // Added sku field
        }
      ]
    }));
  };
  
  // Remove variant
  const removeVariant = (index) => {
    if (formData.variants.length === 1) {
      alert('Product must have at least one variant');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Generate SKU
  const generateSku = (variant, index) => {
    // Simple SKU generation logic - you might want to enhance this
    const productCode = formData.name.substring(0, 3).toUpperCase();
    const colorCode = variant.color.name.substring(0, 2).toUpperCase();
    const sizeCode = variant.size.substring(0, 1).toUpperCase();
    
    return `${productCode}-${colorCode}-${sizeCode}-${index + 1}`;
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // In a real app, you would upload these to a server and get back URLs
    // For demo purposes, we'll create object URLs
    const newImages = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };
  
  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    // Validate variants
    formData.variants.forEach((variant, index) => {
      if (!variant.color.name.trim()) {
        newErrors[`variants[${index}].color.name`] = 'Color name is required';
      }
      
      if (!variant.size.trim()) {
        newErrors[`variants[${index}].size`] = 'Size is required';
      }
      
      if (variant.price <= 0) {
        newErrors[`variants[${index}].price`] = 'Price must be greater than 0';
      }
      
      if (variant.stock < 0) {
        newErrors[`variants[${index}].stock`] = 'Stock cannot be negative';
      }
      if (!variant.sku.trim()) {
        // Auto-generate SKU if missing
        const sku = generateSku(variant, index);
        setFormData(prev => {
          const updatedVariants = [...prev.variants];
          updatedVariants[index] = {
            ...updatedVariants[index],
            sku
          };
          return { ...prev, variants: updatedVariants };
        });
      }

    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    try {
      setSubmitting(true);
      
      // In a real app, you would properly handle the images here
      // For this demo, we'll just use the URLs directly
      
      if (isEditMode) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products')}
          icon={<ArrowLeftIcon className="w-5 h-5" />}
          iconPosition="left"
        >
          Back to Products
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                  ></textarea>
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-[#660E36] focus:ring-[#660E36] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Product is active and available for purchase
                  </label>
                </div>
              </div>
              
              {/* Images */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className="flex flex-wrap gap-4 mb-2">
                    {formData.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative w-24 h-24 border rounded-md overflow-hidden group"
                      >
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Upload high-quality images of your product. First image will be used as the main product image.
                  </p>
                </div>
              </div>
              
              {/* Variants */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Product Variants</h2>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addVariant}
                    icon={<PlusIcon className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Add Variant
                  </Button>
                </div>
                
                {formData.variants.map((variant, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Variant {index + 1}</h3>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        icon={<TrashIcon className="w-4 h-4" />}
                        iconPosition="left"
                        className="text-red-600 hover:text-red-700"
                        disabled={formData.variants.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color Name
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="text"
                          value={variant.color.name}
                          onChange={(e) => handleVariantChange(index, 'color.name', e.target.value)}
                          className={`w-full px-4 py-2 border ${errors[`variants[${index}].color.name`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                        />
                        {errors[`variants[${index}].color.name`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`variants[${index}].color.name`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <div className="flex items-center">
                          <input
                            type="color"
                            value={variant.color.code}
                            onChange={(e) => handleVariantChange(index, 'color.code', e.target.value)}
                            className="h-10 w-10 border-0 p-0 mr-2"
                          />
                          <input
                            type="text"
                            value={variant.color.code}
                            onChange={(e) => handleVariantChange(index, 'color.code', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          value={variant.size}
                          onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                          className={`w-full px-4 py-2 border ${errors[`variants[${index}].size`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                        >
                          <option value="">Select Size</option>
                          {sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                        {errors[`variants[${index}].size`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`variants[${index}].size`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className={`w-full px-4 py-2 border ${errors[`variants[${index}].price`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                        />
                        {errors[`variants[${index}].price`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`variants[${index}].price`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={variant.stock}
                          onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
                          className={`w-full px-4 py-2 border ${errors[`variants[${index}].stock`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                        />
                        {errors[`variants[${index}].stock`] && (
                          <p className="mt-1 text-sm text-red-600">{errors[`variants[${index}].stock`]}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                          className={`w-full px-4 py-2 border ${errors[`variants[${index}].sku`] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#660E36] focus:border-[#660E36]`}
                          placeholder="Product SKU"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleVariantChange(index, 'sku', generateSku(variant, index))}
                          className="ml-2 whitespace-nowrap"
                        >
                          Generate SKU
                        </Button>
                      </div>
                      {errors[`variants[${index}].sku`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`variants[${index}].sku`]}</p>
                      )}
                    </div>
                  
                  </div>

                  
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/products')}
              disabled={submitting}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;