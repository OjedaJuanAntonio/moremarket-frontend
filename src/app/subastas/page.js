'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SubastasPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (token) {
      fetch('http://localhost:8000/api/auctions/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al obtener las subastas.');
          }
          return response.json();
        })
        .then((data) => {
          setAuctions(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setError('Por favor, inicia sesión para ver las subastas.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Cargando subastas...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (auctions.length === 0) {
    return <p>No hay subastas activas en este momento.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Subastas Activas</h1>
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id} className="mb-4">
            <Link href={`/subastas/${auction.id}`} className="text-blue-600 hover:underline">
              {auction.product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
