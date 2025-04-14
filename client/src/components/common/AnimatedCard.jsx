// src/components/common/AnimatedCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  onClick, 
  delay = 0,
  animateHover = true
}) => {
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={animateHover ? { y: -5, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;