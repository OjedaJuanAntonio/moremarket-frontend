// src/pages/subastas/SubastasActivas.js
import { useEffect, useState } from 'react';
import AuctionCard from '@/components/AuctionCard';

const SubastasActivas = () => {
  const [auctions, setAuctions] = useState({ active_auctions: [], finished_auctions: [] });

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/auctions/');
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error('Error al cargar las subastas:', error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Subastas Activas</h1>
      {auctions.active_auctions.length > 0 ? (
        auctions.active_auctions.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))
      ) : (
        <p className="text-gray-600">No hay subastas activas en este momento.</p>
      )}
    </div>
  );
};

export default SubastasActivas;
