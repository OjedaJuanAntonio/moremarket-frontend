'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '@/utils/auth';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(isAuthenticated()); // Verifica si el usuario está autenticado
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/subastas">Subastas</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link href="/auction-management">Gestión de Subastas</Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login">Iniciar sesión</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
