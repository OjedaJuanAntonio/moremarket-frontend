"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart } from "@/utils/cart";

export default function CarritoPage() {
  const [cartItems, setCartItems] = useState([]);
  
  useEffect(() => {
    const storedCart = getCart();
    setCartItems(storedCart);
  }, []);
  
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Carrito de Compras</h1>
      {cartItems.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio unitario: ${item.price}</p>
                </div>
                <div>
                  <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <Link href="/checkout">
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
                Proceder a Pagar
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
