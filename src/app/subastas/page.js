"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function SubastasActivas() {
  const [auctions, setAuctions] = useState([]); // Estado para guardar las subastas activas
  const [timers, setTimers] = useState({}); // Estado para guardar los temporizadores

  // Obtener subastas desde la API y filtrar las que no han caducado
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/auctions/");
        if (!response.ok) {
          throw new Error("Error al obtener las subastas");
        }
        const data = await response.json();
        // Filtra las subastas para que sólo queden aquellas cuyo end_time es futuro
        const activeAuctions = data.filter(
          (auction) => new Date(auction.end_time) > new Date()
        );
        setAuctions(activeAuctions);
      } catch (error) {
        console.error("Error al cargar las subastas:", error);
      }
    };

    fetchAuctions();
  }, []);

  // Calcular tiempo restante y actualizar los temporizadores
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = auctions.reduce((acc, auction) => {
        const timeLeft = new Date(auction.end_time) - new Date();
        acc[auction.id] = timeLeft > 0 ? timeLeft : 0;
        return acc;
      }, {});
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  // Función para formatear el tiempo restante
  const formatTime = (ms) => {
    if (ms <= 0) return "Finalizada";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Subastas Activas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.length > 0 ? (
          auctions.map((auction) => (
            <div key={auction.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={auction.item_image || "/placeholder.png"}
                alt={auction.item_name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-bold text-blue-600 mb-2">
                <Link href={`/subastas/${auction.id}`}>{auction.item_name}</Link>
              </h2>
              <p className="text-gray-600 mb-1">Precio inicial: ${auction.starting_price}</p>
              <p className="text-gray-600 mb-4">
                Tiempo restante: <span className="font-bold">{formatTime(timers[auction.id])}</span>
              </p>
              <div className="flex justify-between">
                <Link href={`/subastas/${auction.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Ver Detalles
                  </button>
                </Link>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Participar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay subastas activas.</p>
        )}
      </div>
    </div>
  );
}
