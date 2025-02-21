"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function VendedorDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Si user está definido, se usa su ID; de lo contrario, el endpoint usará el ID del usuario autenticado
        const sellerId = user ? user.id : "";
        const res = await fetch(`http://localhost:8000/api/dashboard/vendedor/?seller=${sellerId}`);
        if (!res.ok) {
          throw new Error(`Error al obtener las métricas: ${res.status}`);
        }
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    if (user) {
      fetchMetrics();
    } else {
      setFetching(false);
    }
  }, [user]);

  if (loading || fetching) return <p>Cargando dashboard de vendedor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!metrics) return <p>No se encontraron métricas.</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Dashboard Vendedor</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Ventas Totales</h2>
          <p className="text-2xl">${metrics.total_sales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Pedidos Recibidos</h2>
          <p className="text-2xl">{metrics.total_orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Productos Activos</h2>
          <p className="text-2xl">{metrics.active_products}</p>
        </div>
      </div>
    </div>
  );
}
