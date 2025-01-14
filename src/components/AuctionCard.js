import Image from 'next/image';
import { useState } from 'react';

const AuctionCard = ({ auction }) => {
  const { product, start_time, end_time, bids } = auction;
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleBidSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Por favor, inicia sesión para realizar una puja.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/bids/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auction: auction.id,
          amount: bidAmount,
        }),
      });
  
      if (response.ok) {
        setSuccessMessage('Puja realizada con éxito.');
        setBidAmount('');
        setErrorMessage('');
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || 'Error al realizar la puja.');
      }
    } catch (error) {
      setErrorMessage('Error al conectarse con el servidor.');
    }
  };
  
  

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      {/* Imagen del producto */}
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-md"
      />

      {/* Nombre y descripción del producto */}
      <h3 className="text-lg font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>

      {/* Precio inicial */}
      <p className="text-gray-800 font-bold mt-2">Precio inicial: ${product.price}</p>

      {/* Fecha de inicio y fin */}
      <p className="text-sm text-gray-500 mt-1">Inicio: {new Date(start_time).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Fin: {new Date(end_time).toLocaleString()}</p>

      {/* Historial de pujas */}
      {bids && bids.length > 0 ? (
        <div className="mt-4">
          <h4 className="font-bold text-gray-700">Historial de Pujas:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {bids.map((bid) => (
              <li key={bid.id}>
                Usuario {bid.user}: ${bid.amount} - {new Date(bid.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Sin pujas aún.</p>
      )}

      {/* Formulario de puja */}
      <form onSubmit={handleBidSubmit} className="mt-4">
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
          Monto de la Puja:
        </label>
        <input
          type="number"
          id="bidAmount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Ingresa tu puja"
          required
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Realizar Puja
        </button>
      </form>

      {/* Mensajes de éxito o error */}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default AuctionCard;
