import axios, { InternalAxiosRequestConfig } from 'axios';

// Use environment variable with fallback to deployed URL
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : 'https://not-risk-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getAppliances = async (filter = '') => {
  const response = await api.get(`/appliance/get?filter=${filter}`);
  return response.data;
};

export const getApplianceDetails = async (id: string) => {
  const response = await api.get(`/appliance/${id}`);
  return response.data;
};

export const updateAppliance = async (id: string, data: any) => {
  const response = await api.put(`/appliance/${id}`, data);
  return response.data;
};

export const addAppliance = async (data: FormData) => {
  const response = await api.post('/appliance/add', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteAppliance = async (id: string) => {
  const response = await api.delete(`/appliance/${id}`);
  return response.data;
};