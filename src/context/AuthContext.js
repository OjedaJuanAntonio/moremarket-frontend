"use client";

import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get('/api/users/profile/');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // const login = async (email, password) => {
    //     const response = await axiosInstance.post('/api/users/login/', { email, password });
    //     localStorage.setItem('access_token', response.data.access);
    //     setUser(response.data.user);
    // };
    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/api/users/login/', {
                email,
                password,
            });
            localStorage.setItem('access_token', response.data.access); // Guardar el token de acceso
            setUser(response.data.user); // Establecer el usuario autenticado
        } catch (error) {
            console.error('Error al iniciar sesión:', error.response?.data || error.message);
            throw error;
        }
    };
    
    const logout = async () => {
        await axiosInstance.post('/api/users/logout/');
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
