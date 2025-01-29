// // frontend/utils/api.js
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const fetchData = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
//     try {
//         const headers = {
//             'Content-Type': 'application/json',
//         };

//         if (requiresAuth) {
//             const token = localStorage.getItem('accessToken');
//             if (!token) {
//                 throw new Error('Token no encontrado. Por favor, inicia sesión.');
//             }
//             headers['Authorization'] = `Bearer ${token}`;
//         }

//         const res = await fetch(`${API_URL}${endpoint}`, {
//             method,
//             headers,
//             body: body ? JSON.stringify(body) : null,
//         });

//         if (res.status === 401 && requiresAuth) {
//             await refreshToken();
//             return fetchData(endpoint, method, body, requiresAuth);
//         }

//         if (!res.ok) {
//             throw new Error(`Error: ${res.status}`);
//         }

//         return await res.json();
//     } catch (error) {
//         console.error('Error en fetchData:', error);
//         throw error;
//     }
// };

// export const refreshToken = async () => {
//     try {
//         const refresh = localStorage.getItem('refreshToken');
//         if (!refresh) {
//             throw new Error('Refresh token no encontrado.');
//         }

//         const res = await fetch(`${API_URL}/api/token/refresh/`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ refresh }),
//         });

//         if (!res.ok) {
//             throw new Error('Error al renovar el token.');
//         }

//         const data = await res.json();
//         localStorage.setItem('accessToken', data.access);
//         return data.access;
//     } catch (error) {
//         console.error('Error al renovar el token:', error);
//         throw error;
//     }
// };


const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Función principal para realizar solicitudes al backend.
 * 
 * @param {string} endpoint - Ruta del endpoint en el backend.
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE).
 * @param {object|null} body - Cuerpo de la solicitud (JSON).
 * @param {boolean} requiresAuth - Si la solicitud requiere autenticación.
 * @returns {Promise<object>} Respuesta del backend como JSON.
 */
export const fetchData = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = localStorage.getItem('access_token'); // Cambiado a `access_token` para consistencia
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión.');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 401 && requiresAuth) {
      // Si el token es inválido o ha expirado, intenta renovarlo
      await refreshToken();
      return fetchData(endpoint, method, body, requiresAuth);
    }

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en fetchData:', error);
    throw error;
  }
};

/**
 * Renueva el token de acceso utilizando el token de refresco.
 * 
 * @returns {Promise<string>} Nuevo token de acceso.
 */
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) {
      throw new Error('Token de refresco no encontrado. Por favor, inicia sesión nuevamente.');
    }

    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      throw new Error('Error al renovar el token.');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access); // Actualiza el token de acceso
    return data.access;
  } catch (error) {
    console.error('Error al renovar el token:', error);
    throw error;
  }
};
