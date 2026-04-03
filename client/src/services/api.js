import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzePassword = async (password) => {
  const response = await api.post('/analyze', { password });
  return response.data;
};

export const generatePassword = async (options) => {
  const response = await api.post('/generate-password', options);
  return response.data;
};

export const generatePassphrase = async (options) => {
  const response = await api.post('/generate-passphrase', options);
  return response.data;
};

export const hashText = async (data) => {
  const response = await api.post('/hash', data);
  return response.data;
};

export const convertData = async (text, type, mode) => {
  const response = await api.post('/convert', { text, type, mode });
  return response.data;
};

export default api;
