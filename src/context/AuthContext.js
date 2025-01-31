// "use client";

// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("AuthProvider inicializado");
//     const fetchUser = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axiosInstance.get("/api/users/profile/", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error al verificar el usuario:", error.message);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     const response = await axiosInstance.post("/api/users/login/", {
//       email,
//       password,
//     });
//     localStorage.setItem("access_token", response.data.access);
//     setUser(response.data.user);
//   };

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


"use client";

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar y refrescar el token
  const verifyToken = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken || !refreshToken) {
      setLoading(false);
      return;
    }

    try {
      // Verificar si el token de acceso es válido
      const profileResponse = await axiosInstance.get("/api/users/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUser(profileResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token de acceso expirado, intentar refrescar
        try {
          const refreshResponse = await axiosInstance.post("/api/users/refresh/", {
            refresh: refreshToken,
          });
          localStorage.setItem("access_token", refreshResponse.data.access);
          setUser(refreshResponse.data.user);
        } catch (refreshError) {
          console.error("Error al refrescar el token:", refreshError);
          logout();
        }
      } else {
        console.error("Error al verificar el usuario:", error);
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (email, password) => {
    const response = await axiosInstance.post("/api/users/login/", {
      email,
      password,
    });
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};