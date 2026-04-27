import axios from 'axios';

const adminAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default adminAxios;