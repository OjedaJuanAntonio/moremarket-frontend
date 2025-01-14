'use client';
import { useEffect, useState } from 'react';
import AuctionCard from '@/components/AuctionCard';

export default function Home() {
  const [activeAuctions, setActiveAuctions] = useState([]);

  useEffect(() => {
    // Llamada al backend para obtener las subastas activas
    fetch('http://localhost:8000/api/auctions/')
      .then((res) => res.json())
      .then((data) => {
        setActiveAuctions(data.active_auctions);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">Subastas Activas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {activeAuctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </main>
  );
}
