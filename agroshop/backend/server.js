import express from 'express';
import cors from 'cors';
import { register, login, getProfile, authMiddleware } from './auth.js';
import {
  getCategories, getProducts, getProduct,
  getCart, addToCart, updateCartItem, removeFromCart, clearCart,
  createOrder, getOrders, getOrder
} from './routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Public routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/categories', getCategories);
app.get('/api/products', getProducts);
app.get('/api/products/:slug', getProduct);

// Protected routes
app.get('/api/auth/me', authMiddleware, getProfile);

app.get('/api/cart', authMiddleware, getCart);
app.post('/api/cart', authMiddleware, addToCart);
app.patch('/api/cart/:id', authMiddleware, updateCartItem);
app.delete('/api/cart/:id', authMiddleware, removeFromCart);
app.delete('/api/cart', authMiddleware, clearCart);

app.post('/api/orders', authMiddleware, createOrder);
app.get('/api/orders', authMiddleware, getOrders);
app.get('/api/orders/:id', authMiddleware, getOrder);

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
