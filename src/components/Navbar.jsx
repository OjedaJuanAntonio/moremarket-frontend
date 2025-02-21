"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // Estados para controlar la visibilidad de los menús desplegables
  const [showSubastasMenu, setShowSubastasMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Referencias para los menús
  const subastasRef = useRef(null);
  const accountRef = useRef(null);

  // Función para asignar clases según si la ruta actual coincide con el enlace
  const linkClasses = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === path ? "bg-white text-blue-600" : "text-white hover:bg-blue-700"
    }`;

  // Alterna el menú de Subastas
  const toggleSubastasMenu = () => {
    setShowSubastasMenu((prev) => !prev);
    setShowAccountMenu(false); // Cierra el otro menú si está abierto
  };

  // Alterna el menú de Mi Cuenta
  const toggleAccountMenu = () => {
    setShowAccountMenu((prev) => !prev);
    setShowSubastasMenu(false); // Cierra el otro menú si está abierto
  };

  // Cierra los menús si se hace clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        subastasRef.current && !subastasRef.current.contains(event.target) &&
        accountRef.current && !accountRef.current.contains(event.target)
      ) {
        setShowSubastasMenu(false);
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          MoreMarket
        </Link>
        {/* Enlaces principales */}
        <Link href="/tienda" className={linkClasses("/tienda")}>
          Tienda
        </Link>
        <Link href="/subastas" className={linkClasses("/subastas")}>
          Subastas
        </Link>
      </div>
      <ul className="flex space-x-4 items-center">
        {isLoggedIn ? (
          <>
            {/* Dropdown Gestión de Subastas */}
            <li className="relative" ref={subastasRef}>
              <button
                onClick={toggleSubastasMenu}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={showSubastasMenu}
              >
                Gestión de Subastas
              </button>
              {showSubastasMenu && (
                <ul className="absolute right-0 bg-white text-black rounded shadow-lg p-2 mt-2 w-48 transition-all duration-200">
                  <li>
                    <Link href="/crear-subasta">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Crear Subasta
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/subastas/mis-subastas">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Mis Subastas
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/subastas/caducadas">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Subastas Caducadas
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Dropdown Mi Cuenta */}
            <li className="relative" ref={accountRef}>
              <button
                onClick={toggleAccountMenu}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={showAccountMenu}
              >
                Mi Cuenta
              </button>
              {showAccountMenu && (
                <ul className="absolute right-0 bg-white text-black rounded shadow-lg p-2 mt-2 w-48 transition-all duration-200">
                  <li>
                    <Link href="/perfil">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Ver Perfil
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/perfil/editar">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Editar Perfil
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/mis-pedidos">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Mis Pedidos
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/ventas">
                      <span className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        Ventas
                      </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Botón de Cerrar Sesión */}
            <li>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-600 transition-colors focus:outline-none"
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
