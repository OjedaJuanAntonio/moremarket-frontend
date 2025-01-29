"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isAuthenticated, logout } from "@/utils/auth";

const Navbar = () => {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(isAuthenticated());
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

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
            <li className="relative group">
              <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                Gestión de Subastas
              </button>
              {/* Dropdown */}
              <ul className="absolute hidden group-hover:block bg-white text-black rounded shadow-lg p-2 mt-2">
                <li>
                  <Link href="/crear-subasta" className="block px-4 py-2 hover:bg-gray-200">
                    Crear Subasta
                  </Link>
                </li>
                <li>
                  <Link href="/mis-subastas" className="block px-4 py-2 hover:bg-gray-200">
                    Mis Subastas
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
