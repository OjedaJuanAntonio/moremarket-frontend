// "use client";

// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { refreshToken as refreshTokenUtil, logout as logoutUtil } from "../utils/auth";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Carga el usuario almacenado en localStorage
//   const loadUserFromStorage = () => {
//     const userData = localStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   };

//   // Verifica el token consultando el endpoint de perfil
//   const verifyToken = async () => {
//     try {
//       const response = await axiosInstance.get("/api/users/profile/");
//       // Suponiendo que el endpoint devuelve los datos completos del usuario:
//       setUser(response.data);
//     } catch (error) {
//       // Si falla, intenta cargar el usuario almacenado (si existe)
//       const storedUser = loadUserFromStorage();
//       if (storedUser) {
//         setUser(storedUser);
//       } else {
//         setUser(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post("/api/users/login/", { email, password });
      
//       localStorage.setItem("access_token", response.data.access);
//       localStorage.setItem("refresh_token", response.data.refresh);
//       localStorage.setItem(
//         "user",
//         JSON.stringify({
//           email: response.data.user.email,
//           id: response.data.user.id,
//         })
//       );
      
//       setUser(response.data.user);
//       window.location.reload();
//       return true;

//     } catch (error) {
//       console.error("Login error:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     // Usamos la función de cierre de sesión desde utils (si la tienes centralizada)
//     logoutUtil();
//     setUser(null);
//   };

//   useEffect(() => {
//     verifyToken();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

"use client";

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { refreshToken as refreshTokenUtil, logout as logoutUtil } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga el usuario almacenado en localStorage
  const loadUserFromStorage = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  // Verifica si existe un token antes de intentar obtener el perfil
  const verifyToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/api/users/profile/");
      // Suponiendo que el endpoint devuelve los datos completos del usuario:
      setUser(response.data);
    } catch (error) {
      // Si falla, intenta cargar el usuario almacenado (si existe)
      const storedUser = loadUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/api/users/login/", { email, password });
      
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: response.data.user.email,
          id: response.data.user.id,
        })
      );
      
      setUser(response.data.user);
      window.location.reload();
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    logoutUtil();
    setUser(null);
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
