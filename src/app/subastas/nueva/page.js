'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/utils/auth'; // Importamos la función de manejo del token

export default function SubastasPage() {
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const token = getToken(); // Obtén el token de manera centralizada

      fetch('http://localhost:8000/api/auctions/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al obtener las subastas activas.');
          }
          return res.json();
        })
        .then((data) => setAuctions(data.active_auctions || []))
        .catch((err) => setError(err.message));
    } catch (err) {
      setError(err.message); // Maneja errores del token o generales
    }
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Subastas Activas</h1>
      <ul>
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <li key={auction.id} className="mb-4">
              <Link href={`/subastas/${auction.id}`}>
                <a className="text-blue-600 hover:underline">
                  {auction.product.name} - Precio inicial: ${auction.product.price}
                </a>
              </Link>
            </li>
          ))
        ) : (
          <p>No hay subastas activas en este momento.</p>
        )}
      </ul>
    </div>
  );
}
