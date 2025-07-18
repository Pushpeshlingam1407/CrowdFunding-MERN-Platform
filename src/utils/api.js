import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred. Please try again.');
    }
    return Promise.reject(error);
  }
);

// API endpoints for auth
export const authAPI = {
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = response.data.token;
    }
    return response;
  },
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = response.data.token;
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    return api.post('/auth/logout');
  }
};

// API endpoints for projects
export const projectAPI = {
  createProject: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => {
          formData.append(key, file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    return api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAllProjects: () => api.get('/projects'),
  getUserProjects: () => api.get('/projects/user'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  updateProject: (id, data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => {
          formData.append(key, file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    return api.put(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteProject: (id) => api.delete(`/projects/${id}`)
};

// API endpoints for users
export const userAPI = {
  getProfile: () => api.get(`/${users}/profile`),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats')
};

// API endpoints for investments
export const investmentAPI = {
  create: (data) => api.post('/investments', data),
  getUserInvestments: () => api.get('/investments/user'),
  getProjectInvestments: (projectId) => api.get(`/investments/project/${projectId}`),
  getStats: () => api.get('/investments/stats')
};

// API endpoints for documents
export const documentAPI = {
  upload: (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList) {
        Array.from(value).forEach(file => {
          formData.append(key, file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    return api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getUserDocuments: () => api.get('/documents'),
  getDocumentById: (id) => api.get(`/documents/${id}`),
  deleteDocument: (id) => api.delete(`/documents/${id}`)
};

export default api; 