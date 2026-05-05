import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Products
export const fetchProducts = (params = {}) =>
  API.get('/products', { params });

export const fetchProductById = (id) =>
  API.get(`/products/${id}`);

export const fetchCategories = () =>
  API.get('/products/categories');

// Orders
export const placeOrder = (orderData) =>
  API.post('/orders', orderData);

export const fetchOrderById = (id) =>
  API.get(`/orders/${id}`);

export default API;
