"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  // Usamos el contexto para obtener el usuario y el método logout
  const { user, logout } = useContext(AuthContext);
  // Se considera logueado si existe un objeto usuario
  const isLoggedIn = !!user;

  // Función para asignar clases según si la ruta actual coincide con la ruta del enlace
  const linkClasses = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === path ? "bg-white text-blue-600" : "text-white hover:bg-blue-700"
    }`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link href="/" className="text-xl font-bold">
        MoreMarket
      </Link>
      <ul className="flex space-x-4 items-center">
        <li>
          <Link href="/subastas" className={linkClasses("/subastas")}>
            Subastas
          </Link>
        </li>
        {isLoggedIn ? (
          <>
            {/* Dropdown para Gestión de Subastas */}
            <li className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Gestión de Subastas
              </button>
              <ul className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg p-2 mt-2">
                <li>
                  <Link
                    href="/crear-subasta"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Crear Subasta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subastas/mis-subastas"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Mis Subastas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subastas/caducadas"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Subastas Caducadas
                  </Link>
                </li>
              </ul>
            </li>
            {/* Dropdown para la cuenta del usuario */}
            <li className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Mi Cuenta
              </button>
              <ul className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg p-2 mt-2">
                <li>
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Ver Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/perfil/editar"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Editar Perfil
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className={linkClasses("/login")}>
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
