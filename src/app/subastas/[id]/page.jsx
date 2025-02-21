"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { getToken } from "@/utils/auth";
import Link from "next/link";

export default function DetallesSubasta() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Obtener detalles de la subasta y pujas
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
        if (!response.ok) throw new Error('Error al cargar la subasta');
        const data = await response.json();
        setAuction(data);
        setBids(Array.isArray(data.bids) ? data.bids : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  // Configurar WebSocket para pujas en tiempo real
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/auctions/${id}/`);
    
    ws.onopen = () => console.log("✅ WebSocket conectado");
    
    ws.onmessage = (event) => {
      const newBid = JSON.parse(event.data);
      if (!newBid.created_at) newBid.created_at = new Date().toISOString();
      setBids((prev) => [...prev, newBid]);
    };

    ws.onerror = (error) => console.error("❌ Error en WebSocket:", error);
    ws.onclose = () => console.log("⚠️ WebSocket cerrado");

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [id]);

  // Obtener la puja más alta
  const getHighestBid = () => {
    if (!auction) return 0;
    return bids.length > 0 
      ? Math.max(...bids.map(bid => Number(bid.amount))) 
      : Number(auction.starting_price);
  };

  // Obtener últimas 5 pujas
  const recentBids = [...bids]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Enviar una nueva puja
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('Debes iniciar sesión para pujar');
      return;
    }

    const numericAmount = parseFloat(bidAmount);
    const highestBid = getHighestBid();

    if (numericAmount <= highestBid) {
      setError(`Debes pujar más alto que ${highestBid}`);
      return;
    }

    try {
      const token = getToken();

      // **1️⃣ Enviar la puja al backend (guardado en la base de datos)**
      const response = await fetch("http://localhost:8000/api/bids/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          auction: id,
          amount: numericAmount
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Error al enviar la puja");
      }

      const newBid = await response.json();
      console.log("✅ Puja guardada en la base de datos:", newBid);

      // **2️⃣ Notificar a otros clientes con WebSocket**
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          amount: numericAmount,
          user: user.email,
          created_at: newBid.created_at, // Fecha de la base de datos
          auction_id: id
        }));
      }

      // Actualizar la lista de pujas en el estado
      setBids((prev) => [...prev, newBid]);
      setBidAmount('');
      setSuccess('Puja enviada correctamente');

    } catch (err) {
      console.error("🚨 Error al enviar la puja:", err.message);
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-8">Cargando subasta...</div>;
  if (!auction) return <div className="text-center text-red-500 mt-8">Subasta no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{auction.item_name}</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={auction.item_image || "/placeholder.png"}
            alt={auction.item_name}
            className="w-full md:w-1/2 h-64 object-cover rounded-md"
          />
          
          <div className="flex-1 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-600">
                <span className="font-semibold">Descripción:</span> {auction.item_description}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Precio inicial:</span> ${auction.starting_price}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Puja más alta:</span> ${getHighestBid()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Finaliza el:</span> {new Date(auction.end_time).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrese su puja:
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  step="0.01"
                  required
                />
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
                Realizar puja
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
