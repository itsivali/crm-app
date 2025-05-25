import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api/' });

// Clients
export const fetchClients = () => api.get('/clients');
export const createClient = data => api.post('/clients', data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = id => api.delete(`/clients/${id}`);

// Services
export const fetchServices = () => api.get('/services');
export const createService = data => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = id => api.delete(`/services/${id}`);

// Invoices
export const fetchInvoices = () => api.get('/invoices');
export const createInvoice = data => api.post('/invoices', data);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data);
export const deleteInvoice = id => api.delete(`/invoices/${id}`);
export const payInvoice = id => api.post(`/invoices/${id}/pay`);

// Receipts
export const fetchReceipts = () => api.get('/receipts');
export const createReceipt = data => api.post('/receipts', data);
export const deleteReceipt = id => api.delete(`/receipts/${id}`);