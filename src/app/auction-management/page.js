"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

const SubastaDetalle = () => {
  const { id } = useParams(); // Obtiene el ID desde la URL dinámica
  const [auction, setAuction] = useState(null);
  const [highestBid, setHighestBid] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');

  // Verificación del ID
  console.log('ID de subasta obtenido:', id);

  useEffect(() => {
    if (!id) {
      console.error('No se encontró el ID en la URL.');
      return;
    }

    const fetchAuction = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/subastas/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la subasta');
        }
        const data = await response.json();
        console.log('Datos de la subasta:', data);
        setAuction(data);
        setHighestBid(data.highest_bid);
      } catch (error) {
        console.error('Error en la llamada a la API:', error);
      }
    };

    fetchAuction();
  }, [id]);

  const handleBidSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/subastas/${id}/pujas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: bidAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al realizar la puja');
      }

      alert('Puja realizada con éxito');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!auction) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{auction.product.name}</h1>
      <p>Descripción: {auction.product.description}</p>
      <p>Puja más alta: {highestBid ? `$${highestBid.amount}` : 'No hay pujas'}</p>

      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Ingresa tu puja"
      />
      <button onClick={handleBidSubmit}>Realizar Puja</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SubastaDetalle;
