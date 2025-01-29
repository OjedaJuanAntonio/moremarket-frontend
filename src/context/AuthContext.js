// "use client";

// import React, { createContext, useState, useEffect } from 'react';
// import axiosInstance from '../utils/axiosInstance';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario autenticado
//     const [loading, setLoading] = useState(true); // Estado para indicar si se está cargando la autenticación
//     const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para verificar si el usuario está autenticado

//     // Función para verificar el estado de la sesión al cargar la aplicación
//     useEffect(() => {
//         const fetchUser = async () => {
//             const token = localStorage.getItem('access_token'); // Obtén el token del almacenamiento local
//             if (!token) {
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const response = await axiosInstance.get('/api/users/profile/', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setUser(response.data); // Establece los datos del usuario autenticado
//                 setIsAuthenticated(true); // Marca como autenticado
//             } catch (error) {
//                 console.error('Error al verificar el usuario:', error.response?.data || error.message);
//                 setUser(null);
//                 setIsAuthenticated(false);
//             } finally {
//                 setLoading(false); // Finaliza el estado de carga
//             }
//         };

//         fetchUser();
//     }, []);

//     // Función para manejar el inicio de sesión
//     const login = async (email, password) => {
//         try {
//             const response = await axiosInstance.post('/api/users/login/', {
//                 email,
//                 password,
//             });

//             localStorage.setItem('access_token', response.data.access); // Guarda el token de acceso
//             setUser(response.data.user); // Establece los datos del usuario autenticado
//             setIsAuthenticated(true); // Marca como autenticado
//         } catch (error) {
//             console.error('Error al iniciar sesión:', error.response?.data || error.message);
//             throw error; // Lanza el error para manejarlo en la interfaz
//         }
//     };

//     // Función para manejar el cierre de sesión
//     const logout = async () => {
//         try {
//             await axiosInstance.post('/api/users/logout/');
//             localStorage.removeItem('access_token'); // Elimina el token de acceso
//             setUser(null); // Limpia los datos del usuario
//             setIsAuthenticated(false); // Marca como no autenticado
//         } catch (error) {
//             console.error('Error al cerrar sesión:', error.response?.data || error.message);
//         }
//     };

//     // Proveer valores del contexto
//     return (
//         <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

"use client";

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider inicializado");
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error al verificar el usuario:", error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post("/api/users/login/", {
      email,
      password,
    });
    localStorage.setItem("access_token", response.data.access);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
