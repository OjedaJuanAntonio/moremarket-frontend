"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getToken } from '@/utils/auth';

export default function GestionSubastasPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleApiResponse = (data) => {
    if (!Array.isArray(data)) {
      return Object.values(data);
    }
    return data;
  };

  useEffect(() => {
    const token = getToken();
    fetch('http://localhost:8000/api/auctions/', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener las subastas.');
        }
        return res.json();
      })
      .then((data) => {
        setAuctions(handleApiResponse(data));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      if (confirm('¿Estás seguro de que deseas eliminar esta subasta?')) {
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert('Subasta eliminada con éxito.');
          setAuctions((prevAuctions) => prevAuctions.filter((auction) => auction.id !== id));
        } else {
          alert('Error al eliminar la subasta.');
        }
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <p>Cargando subastas...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Gestión de Subastas</h1>
      <Link href="/subastas/gestion/nueva" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">
        Crear Nueva Subasta
      </Link>
      <ul className="mt-4">
        {Array.isArray(auctions) && auctions.length > 0 ? (
          auctions.map((auction) => (
            <li key={auction.id} className="mb-4 border p-4 rounded-md shadow-md bg-white">
              <h2 className="text-2xl font-bold">{auction.item_name}</h2>
              <p>Inicio: {new Date(auction.start_time).toLocaleString()}</p>
              <p>Fin: {new Date(auction.end_time).toLocaleString()}</p>
              <div className="flex gap-4 mt-2">
                <Link href={`/subastas/gestion/${auction.id}/editar`} className="text-blue-600 hover:underline">
                  Editar
                </Link>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(auction.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay subastas disponibles.</p>
        )}
      </ul>
    </div>
  );
}
