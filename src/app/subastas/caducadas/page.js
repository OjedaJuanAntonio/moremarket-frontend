"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function SubastasCaducadas() {
  const [auctions, setAuctions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("http://localhost:8000/api/auctions/");
        if (!response.ok) {
          throw new Error("Error al obtener las subastas");
        }
        const data = await response.json();
        // Filtrar las subastas caducadas: end_time es menor o igual que la fecha actual
        const expiredAuctions = data.filter(
          (auction) => new Date(auction.end_time) <= new Date()
        );
        setAuctions(expiredAuctions);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }

    fetchAuctions();
  }, []);

  if (fetching) {
    return <p className="text-center mt-8">Cargando subastas caducadas...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Subastas Caducadas</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={auction.item_image || "/placeholder.png"}
                alt={auction.item_name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold text-blue-600 mb-2">
                <Link
                  href={`/subastas/${auction.id}`}
                  className="hover:underline"
                >
                  {auction.item_name}
                </Link>
              </h2>
              <p className="text-gray-600 mb-1">
                Precio inicial: ${auction.starting_price}
              </p>
              <p className="text-gray-600 mb-4">Finalizada</p>
              <div className="flex justify-between">
                <Link
                  href={`/subastas/${auction.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay subastas caducadas.</p>
      )}
    </div>
  );
}
