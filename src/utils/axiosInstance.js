import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // URL base del backend
    withCredentials: true, // Permitir cookies
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    // Excluir el token para el endpoint de login
    if (token && !config.url.includes('/api/users/login/')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Token inválido o expirado');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
