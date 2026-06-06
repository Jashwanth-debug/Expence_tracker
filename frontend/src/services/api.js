import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

export const ocrService = {
  extractText: (formData) => axios.post(`${API_URL}/ocr`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const invoiceService = {
  getAll: () => axios.get(`${API_URL}/invoices`),
  getById: (id) => axios.get(`${API_URL}/invoices/${id}`),
  create: (data) => axios.post(`${API_URL}/invoices`, data),
  update: (id, data) => axios.put(`${API_URL}/invoices/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/invoices/${id}`)
};

export const dashboardService = {
  getStats: () => axios.get(`${API_URL}/dashboard/stats`)
};
