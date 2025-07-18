import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isAdmin: JSON.parse(localStorage.getItem('user'))?.role === 'admin' || false,
  isLoading: false,
  error: null,

  updateUser: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    set({
      user: userData,
      isAdmin: userData.role === 'admin'
    });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { success, token, user } = response.data;
      
      if (!success) {
        throw new Error('Login failed');
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Store token and user data
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set default auth header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
      
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
        error: null
      });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: error.response?.data?.message || 'Login failed'
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { success, token, user } = response.data;
      
      if (!success) {
        throw new Error('Registration failed');
      }

      // Remove 'Bearer ' prefix if present
      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      localStorage.setItem('token', cleanToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`;
      
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
        error: null
      });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null
    });
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, isAdmin: false });
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true
      });
      
      const { success, user: userData } = response.data;
      
      if (!success) {
        throw new Error('Auth check failed');
      }

      localStorage.setItem('user', JSON.stringify(userData));

      set({
        user: userData,
        isAuthenticated: true,
        isAdmin: userData.role === 'admin',
        isLoading: false,
        error: null
      });
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null
      });
    }
  }
}));

// Initialize axios auth header from localStorage
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Set default axios config
axios.defaults.withCredentials = true;

export default useAuthStore;
