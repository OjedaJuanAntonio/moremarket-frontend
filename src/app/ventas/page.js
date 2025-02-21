"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function VentasPage() {
  const { user, loading } = useContext(AuthContext);
  const [sales, setSales] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8000/api/orders/");
        if (!response.ok) {
          throw new Error("Error al obtener las órdenes");
        }
        const data = await response.json();
        // Si la API usa paginación, usamos data.results
        const orders = data.results || data;
        // Filtrar las órdenes que tengan al menos un item cuyo producto.seller.id coincida con el id del usuario
        const sellerOrders = orders.filter(order =>
          order.items &&
          order.items.some(
            item =>
              item.product &&
              item.product.seller &&
              item.product.seller.id === user.id
          )
        );
        setSales(sellerOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading || fetching) return <p>Cargando ventas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Ventas</h1>
      {sales.length > 0 ? (
        <ul className="space-y-4">
          {sales.map((order) => (
            <li key={order.id} className="bg-white p-4 rounded shadow">
              <p>
                <strong>ID del Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Total:</strong> ${order.total}
              </p>
              <p>
                <strong>Estado:</strong> {order.status}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}
              </p>
              <Link href={`/ventas/${order.id}`}>
                <span className="text-blue-500 hover:underline cursor-pointer">Ver Detalles</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes ventas registradas.</p>
      )}
    </div>
  );
}
