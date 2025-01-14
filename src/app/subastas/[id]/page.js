'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuctionCard from '@/components/AuctionCard';

export default function SubastaDetalle() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (id && token) {
      fetch(`http://localhost:8000/api/auctions/${id}/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => setAuction(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!auction) {
    return <p>Cargando subasta...</p>;
  }

  return (
    <div className="p-6">
      <AuctionCard auction={auction} />
    </div>
  );
}
