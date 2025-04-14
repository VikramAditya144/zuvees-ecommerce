// src/hooks/useCart.js
import { useRecoilState } from 'recoil';
import { cartState } from '../recoil/atoms/cartAtom';

export const useCart = () => {
  const [cart, setCart] = useRecoilState(cartState);

  // Add item to cart
  const addToCart = (product, variant, quantity = 1) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product._id === product._id && item.variant._id === variant._id
      );

      let updatedItems = [...prevCart.items];

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        updatedItems.push({
          product,
          variant,
          quantity
        });
      }

      // Calculate totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total, item) => total + (item.variant.price * item.quantity),
        0
      );

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Update item quantity
  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart(prevCart => {
      const updatedItems = prevCart.items.map(item => {
        if (item.product._id === productId && item.variant._id === variantId) {
          return { ...item, quantity };
        }
        return item;
      });

      // Calculate totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total, item) => total + (item.variant.price * item.quantity),
        0
      );

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, variantId) => {
    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(
        item => !(item.product._id === productId && item.variant._id === variantId)
      );

      // Calculate totals
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedItems.reduce(
        (total, item) => total + (item.variant.price * item.quantity),
        0
      );

      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };
};