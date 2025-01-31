"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetallesSubasta() {
  const { id } = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Obtener detalles de la subasta
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
        if (!response.ok) throw new Error("Error al cargar los detalles de la subasta.");
        const data = await response.json();
        setAuction(data);
        setBids(data.bids || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  // Calcular el monto mínimo para la puja
  const minBidAmount = useMemo(() => {
    if (!auction) return 0;
    const lastBid = bids[bids.length - 1]?.amount || 0;
    return Math.max(auction.starting_price, lastBid) + 1;
  }, [auction, bids]);

  // Manejar el envío de la puja
  const handleBidSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Por favor, inicia sesión para participar.");

        const response = await fetch("http://localhost:8000/api/bids/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auction: id, amount: parseFloat(bidAmount) }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.detail || "Error al realizar la puja.");
        }

        const newBid = await response.json();
        setBids((prev) => [...prev, newBid]);
        setSuccess("Puja realizada con éxito.");
        setBidAmount("");
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    },
    [bidAmount, id]
  );

  // Temporizador de tiempo restante
  const timeRemaining = useMemo(() => {
    if (!auction) return "Cargando...";
    const endTime = new Date(auction.end_time);
    const now = new Date();
    const diff = endTime - now;

    if (diff <= 0) return "Subasta finalizada";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }, [auction]);

  // Ordenar y mostrar solo las últimas 5 pujas
  const sortedBids = useMemo(() => {
    return bids
      .sort((a, b) => b.amount - a.amount) // Ordenar de mayor a menor
      .slice(0, 5); // Tomar solo las primeras 5 pujas
  }, [bids]);

  if (loading) return <p className="text-center mt-8">Cargando subasta...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{auction.item_name}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={auction.item_image || "/placeholder.png"}
            alt={auction.item_name}
            className="w-full md:w-1/2 h-auto rounded-md shadow-sm"
          />
          <div className="flex-1">
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Descripción:</span> {auction.item_description}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Precio inicial:</span> ${auction.starting_price}
            </p>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">Tiempo restante:</span> {timeRemaining}
            </p>
            <p className="text-gray-700 mb-6">
              <span className="font-semibold">Creador:</span> {auction.created_by}
            </p>

            <form onSubmit={handleBidSubmit} className="mb-6">
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Monto de la Puja:
              </label>
              <input
                type="number"
                id="bidAmount"
                name="bidAmount"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min={minBidAmount}
                step="0.01"
                required
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Realizar Puja
              </button>
            </form>

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Últimas 5 Pujas</h2>
            <ul className="space-y-2">
              {sortedBids.map((bid) => (
                <li key={bid.id} className="bg-gray-50 p-3 rounded-md shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">{bid.user}</span> ofreció ${bid.amount} el{" "}
                    {new Date(bid.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}