"use client";

import { useState, useEffect } from "react";
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

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Por favor, inicia sesión para participar.");

      const response = await fetch("http://localhost:8000/api/bids/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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
  };

  if (loading) return <p>Cargando subasta...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">{auction.item_name}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={auction.item_image || "/placeholder.png"}
          alt={auction.item_name}
          className="w-full md:w-1/2 h-auto rounded-md"
        />
        <div className="flex-1">
          <p className="text-gray-700 mb-2">Descripción: {auction.item_description}</p>
          <p className="text-gray-700 mb-2">Precio inicial: ${auction.starting_price}</p>
          <p className="text-gray-700 mb-2">Tiempo restante: {/* Agrega un temporizador aquí si deseas */}</p>
          <p className="text-gray-700 mb-4">Creador: {auction.created_by}</p>

          <form onSubmit={handleBidSubmit} className="mb-6">
            <label htmlFor="bidAmount" className="block text-sm font-medium mb-2">
              Monto de la Puja:
            </label>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full border rounded-md p-2 mb-4"
              min={Math.max(auction.starting_price, bids[bids.length - 1]?.amount || 0) + 1}
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Realizar Puja
            </button>
          </form>

          {success && <p className="text-green-500 mb-4">{success}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <h2 className="text-2xl font-bold mb-4">Historial de Pujas</h2>
          <ul className="list-disc ml-4">
            {bids.map((bid) => (
              <li key={bid.id} className="text-gray-700">
                {bid.user} ofreció ${bid.amount} el {new Date(bid.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
