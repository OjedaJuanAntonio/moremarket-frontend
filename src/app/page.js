// 'use client';

// import { useEffect, useState, useContext } from 'react';
// import AuctionCard from '@/components/AuctionCard';
// import { AuthContext } from '../context/AuthContext';

// export default function HomePage() {
//     const { user, loading } = useContext(AuthContext);
//     const [activeAuctions, setActiveAuctions] = useState([]);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchAuctions = async () => {
//             try {
//                 const response = await fetch('http://localhost:8000/api/auctions/');
//                 if (!response.ok) {
//                     throw new Error('Error al obtener las subastas');
//                 }
//                 const data = await response.json();
//                 setActiveAuctions(data.active_auctions || []);
//             } catch (err) {
//                 console.error(err);
//                 setError('No se pudo cargar las subastas activas');
//             }
//         };

//         if (user) {
//             fetchAuctions();
//         }
//     }, [user]);

//     if (loading) return <p>Cargando...</p>;

//     if (!user) {
//         return <p>Por favor, inicia sesión para ver las subastas activas.</p>;
//     }

//     if (error) {
//         return <p className="text-red-500">{error}</p>;
//     }

//     if (activeAuctions.length === 0) {
//         return <p>No hay subastas activas en este momento.</p>;
//     }

//     return (
//         <main className="min-h-screen bg-gray-100 p-6">
//             <h1 className="text-4xl font-bold mb-4">Subastas Activas</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {activeAuctions.map((auction) => (
//                     <AuctionCard key={auction.id} auction={auction} />
//                 ))}
//             </div>
//         </main>
//     );
// }
"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function HomePage() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a MoreMarket</h1>
      {user ? (
        <p>Hola, {user.email}. Bienvenido de nuevo.</p>
      ) : (
        <p>Por favor, inicia sesión para explorar más.</p>
      )}
    </div>
  );
}
