// frontend/utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint, method = 'GET', body = null, requiresAuth = false) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (requiresAuth) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Token no encontrado. Por favor, inicia sesión.');
            }
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        if (res.status === 401 && requiresAuth) {
            await refreshToken();
            return fetchData(endpoint, method, body, requiresAuth);
        }

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Error en fetchData:', error);
        throw error;
    }
};

export const refreshToken = async () => {
    try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            throw new Error('Refresh token no encontrado.');
        }

        const res = await fetch(`${API_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
            throw new Error('Error al renovar el token.');
        }

        const data = await res.json();
        localStorage.setItem('accessToken', data.access);
        return data.access;
    } catch (error) {
        console.error('Error al renovar el token:', error);
        throw error;
    }
};
