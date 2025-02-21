"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TiendaPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:8000/api/products/");
        if (!res.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await res.json();
        // Si la API usa paginación, los productos están en data.results
        const productArray = data.results || data;
        // Filtra solo los productos aprobados (aunque normalmente ya esté filtrado)
        const approvedProducts = productArray.filter(
          (product) => product.is_approved
        );
        setProducts(approvedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Tienda Virtual</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow p-4">
            <img
              src={product.image || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">
              <Link href={`/tienda/${product.id}`}>
                {product.name}
              </Link>
            </h2>
            <p className="mt-1">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
