
// src/services/api.js
import axios from 'axios';

// import an env in the client


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('zuvees-auth') 
//       ? JSON.parse(localStorage.getItem('zuvees-auth')).token 
//       : null;
    
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Modified section of your api.js file
api.interceptors.request.use(
  (config) => {
    // Improved token retrieval with error handling
    let token = null;
    try {
      const authData = localStorage.getItem('zuvees-auth');
      // console.log("Auth Data: ", authData);
      if (authData) {
        const parsedData = JSON.parse(authData);
        // console.log("Parsed Data: ", parsedData);
        token = parsedData.authState.token;
        // console.log("Token: ", token)
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // For debugging
      // console.log('Token attached to request:', token);
    } else {
      console.warn('No token found, request will proceed without authentication');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;