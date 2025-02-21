"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function MisPedidosPage() {
  const { user, loading } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8000/api/orders/");
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        const data = await response.json();
        // Si la API usa paginación, los pedidos estarán en data.results
        const ordersList = data.results || data;
        // Filtrar solo los pedidos donde el buyer es el usuario actual
        const userOrders = ordersList.filter(order => order.buyer === user.id);
        setOrders(userOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    if (user) {
      fetchOrders();
    } else {
      setFetching(false);
    }
  }, [user]);

  if (loading || fetching) return <p>Cargando mis pedidos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Mis Pedidos</h1>
      {orders.length > 0 ? (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order.id} className="bg-white p-4 rounded shadow">
              <p><strong>ID del Pedido:</strong> {order.id}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Estado:</strong> {order.status}</p>
              <p>
                <strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
              <Link href={`/mis-pedidos/${order.id}`}>
                <span className="text-blue-500 hover:underline cursor-pointer">
                  Ver Detalles
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes pedidos.</p>
      )}
    </div>
  );
}
