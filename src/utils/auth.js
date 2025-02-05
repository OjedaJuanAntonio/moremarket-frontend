// // frontend/utils/auth.js

// // Verifica si el usuario está autenticado
// export const isAuthenticated = () => {
//   const token = localStorage.getItem('accessToken');
//   return !!token; // Devuelve true si el token existe
// };

// // Obtiene el token de acceso
// export const getToken = () => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) {
//       throw new Error('Token no encontrado. Por favor, inicia sesión.');
//   }
//   return token;
// };

// // Guarda tokens en localStorage
// export const saveTokens = (accessToken, refreshToken) => {
//   localStorage.setItem('accessToken', accessToken);
//   localStorage.setItem('refreshToken', refreshToken);
// };

// // Elimina los tokens al cerrar sesión
// export const logout = () => {
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('refreshToken');
//   window.location.href = '/';
// };

// utils/auth.js
import axiosInstance from './axiosInstance';

// Verifica autenticación con token válido
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token && !isTokenExpired(token);
};

// Obtiene el token de acceso
export const getToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No hay sesión activa');
  return token;
};

// Guarda tokens y datos de usuario
export const saveAuthData = (access, refresh, user) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  localStorage.setItem('user', JSON.stringify(user));
};

// Intenta renovar el token usando refresh token
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No hay refresh token disponible');

    const response = await axiosInstance.post('/api/token/refresh/', { refresh });
    
    if (!response.data.access) {
      throw new Error('Respuesta inválida al refrescar token');
    }
    
    localStorage.setItem('access_token', response.data.access);
    return response.data.access;

  } catch (error) {
    console.error('Error al refrescar token:', error);
    logout();
    throw error;
  }
};

// Cierre de sesión completo
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Verifica expiración del token (JWT)
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch (error) {
    return true;
  }
};

// Obtiene datos del usuario
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};