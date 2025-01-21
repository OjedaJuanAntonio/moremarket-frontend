// frontend/utils/auth.js

// Verifica si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token; // Devuelve true si el token existe
};

// Obtiene el token de acceso
export const getToken = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
      throw new Error('Token no encontrado. Por favor, inicia sesión.');
  }
  return token;
};

// Guarda tokens en localStorage
export const saveTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Elimina los tokens al cerrar sesión
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/';
};
