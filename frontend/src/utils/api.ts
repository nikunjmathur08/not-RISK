import axios, { InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

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