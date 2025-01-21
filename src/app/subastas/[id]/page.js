'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuctionCard from '@/components/AuctionCard';
import { getToken } from '@/utils/auth';

export default function SubastaDetalle() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const token = getToken();

      if (id) {
        fetch(`http://localhost:8000/api/auctions/${id}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (res.status === 401) {
              throw new Error('Token inválido o ha expirado. Por favor, inicia sesión nuevamente.');
            }
            if (!res.ok) {
              throw new Error(`Error al cargar la subasta: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => setAuction(data))
          .catch((err) => setError(err.message));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>{error}</p>
        {error.includes('Token') && (
          <button
            onClick={() => {
              localStorage.removeItem('token'); // Limpia el token
              window.location.href = '/login'; // Redirige a la página de inicio de sesión
            }}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    );
  }

  if (!auction) {
    return <p>Cargando subasta...</p>;
  }

  return (
    <div className="p-6">
      <AuctionCard auction={auction} />
    </div>
  );
}
