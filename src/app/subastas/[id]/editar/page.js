"use client";

import { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { getToken } from "@/utils/auth";
import Link from "next/link";
import io from "socket.io-client"; // Asegúrate de instalar socket.io-client

export default function DetallesSubasta() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar detalles de la subasta y el historial de pujas desde el backend
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
        if (!response.ok) throw new Error("Error al cargar la subasta");
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

  // WebSocket para escuchar nuevas pujas
  useEffect(() => {
    const newSocket = io("http://localhost:8000");

    newSocket.on("auction_bid", (newBid) => {
      setBids((prev) => [
        ...prev,
        {
          amount: newBid.amount,
          user: newBid.user,
          created_at: new Date().toLocaleString(),
        },
      ]);
    });

    return () => newSocket.disconnect();
  }, []);

  // Calcula la puja más alta actual (o usa el precio inicial si no hay pujas)
  const getHighestBid = () => {
    if (bids.length > 0) {
      return bids.reduce((max, bid) => {
        const amt = Number(bid.amount);
        return amt > max ? amt : max;
      }, Number(auction.starting_price));
    }
    return Number(auction.starting_price);
  };

  // Enviar puja al backend
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("Debes iniciar sesión para pujar");
      return;
    }

    const numericAmount = parseFloat(bidAmount);
    const highestBid = getHighestBid();

    if (numericAmount <= highestBid) {
      setError(`La puja debe ser mayor que ${highestBid}`);
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("http://localhost:8000/api/bids/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auction: id,
          amount: numericAmount,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Error al enviar la puja");
      }

      const newBid = await response.json();
      // Actualizar la lista de pujas agregando la nueva puja
      setBids((prev) => [...prev, newBid]);
      setBidAmount("");
      setSuccess("Puja enviada correctamente");
    } catch (err) {
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingrese su puja:</label>
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

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Realizar puja
              </button>
            </form>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Últimas 5 Pujas</h2>
              {bids.length > 0 ? (
                <ul className="space-y-2">
                  {bids
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5)
                    .map((bid, index) => (
                      <li key={index} className="bg-gray-100 p-2 rounded">
                        <span className="font-semibold">{bid.user}:</span> ${bid.amount}{" "}
                        <small className="text-gray-500">{bid.created_at}</small>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-600">Aún no hay pujas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
