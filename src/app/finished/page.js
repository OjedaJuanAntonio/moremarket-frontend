"use client";

import { useEffect, useState } from 'react';
import AuctionCard from '../../components/AuctionCard';
import { fetchData } from '../../utils/api';

export default function FinishedAuctions() {
    const [finishedAuctions, setFinishedAuctions] = useState([]);

    // Obtener subastas finalizadas desde el backend
    useEffect(() => {
        const getAuctions = async () => {
            try {
                const data = await fetchData('/auctions/');
                setFinishedAuctions(data.finished_auctions);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

        getAuctions();
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold text-center mb-10">Subastas Finalizadas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {finishedAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                ))}
            </div>
        </main>
    );
}
