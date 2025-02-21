"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addToCart } from "@/utils/cart";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:8000/api/products/${id}/`);
        if (!res.ok) {
          throw new Error("Error al obtener el producto");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    // Agrega el producto al carrito
    addToCart(product);
    // Redirige al usuario a la página del carrito
    router.push("/carrito");
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Producto no encontrado</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image || "/placeholder.png"}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-xl font-semibold">${product.price}</p>
      <p className="mt-2">{product.description}</p>
      <button 
        onClick={handleAddToCart} 
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Agregar al Carrito
      </button>
      <Link href="/tienda">
        <p className="mt-4 text-blue-500 hover:underline">Volver a la Tienda</p>
      </Link>
    </div>
  );
}
