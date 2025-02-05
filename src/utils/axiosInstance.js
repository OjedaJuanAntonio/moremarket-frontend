import axios from 'axios';
import { getToken, refreshToken } from './auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const excludedEndpoints = [
      '/api/users/login/',
      '/api/token/refresh/',
      '/api/users/register/'
    ];
    
    // Si la URL de la solicitud coincide con algún endpoint excluido, se retorna el config sin modificar.
    if (excludedEndpoints.some(endpoint => config.url.includes(endpoint))) {
      return config;
    }
    
    // Si no está en los endpoints excluidos, se obtiene el token.
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        localStorage.setItem('access_token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirección directa
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
