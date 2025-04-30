import axios from 'axios';
import clientsMock from '../mockData/clients.json';
import servicesMock from '../mockData/services.json';

const useMocks = process.env.REACT_APP_USE_MOCKS === 'true';
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const wrap = promise => promise;

// Clients
export const fetchClients = () => useMocks ? wrap(Promise.resolve({ data: clientsMock })) : api.get('/clients');
export const createClient = async (data) => {
    try {
        const response = await api.post('/clients', data);
        return response.data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error);
        throw error;
    }
};
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const deleteClient = id => api.delete(`/clients/${id}`);

// Services
export const fetchServices = () => useMocks ? wrap(Promise.resolve({ data: servicesMock })) : api.get('/services');
export const createService = data => api.post('/services', data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = id => api.delete(`/services/${id}`);

// Invoices
export const fetchInvoices = () => api.get('/invoices');
export const createInvoice = data => api.post('/invoices', data);
export const updateInvoice = (id, data) => api.put(`/invoices/${id}`, data);
export const deleteInvoice = id => api.delete(`/invoices/${id}`);
export const payInvoice = id => api.patch(`/invoices/${id}/status`, { status: 'PAID' });

// Receipts
export const fetchReceipts = () => api.get('/receipts');
export const createReceipt = data => api.post('/receipts', data);
export const deleteReceipt = id => api.delete(`/receipts/${id}`);