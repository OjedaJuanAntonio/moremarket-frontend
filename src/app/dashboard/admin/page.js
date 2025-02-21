"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { user, loading } = useContext(AuthContext);
  const [metrics, setMetrics] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/admin/");
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
    if (user && user.is_staff) {
      fetchMetrics();
    } else if (!loading) {
      setError("No tienes permisos de administrador para ver el dashboard.");
      setFetching(false);
    }
  }, [user, loading]);

  if (loading || fetching) return <p>Cargando dashboard de administrador...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Dashboard Administrador</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total de Pedidos</h2>
          <p className="text-2xl">{metrics.total_orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Total de Ventas</h2>
          <p className="text-2xl">${metrics.total_sales}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold">Productos Pendientes</h2>
          <p className="text-2xl">{metrics.pending_products}</p>
        </div>
      </div>
    </div>
  );
}
