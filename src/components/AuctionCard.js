// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// const AuctionCard = ({ auction }) => {
//   const { product, start_time, end_time, bids } = auction;
//   const [bidAmount, setBidAmount] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [currentBids, setCurrentBids] = useState(bids || []);

//   // WebSocket connection
//   useEffect(() => {
//     const ws = new WebSocket(`ws://localhost:8000/ws/auctions/${auction.id}/`);

//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.amount) {
//         setCurrentBids((prevBids) => [
//           ...prevBids,
//           {
//             user: data.user,
//             amount: data.amount,
//             created_at: new Date().toISOString(),
//           },
//         ]);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//     };

//     return () => ws.close();
//   }, [auction.id]);

//   const handleBidSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('token');
//     if (!token) {
//       setErrorMessage('Por favor, inicia sesión para realizar una puja.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8000/api/bids/`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           auction: auction.id,
//           amount: bidAmount,
//         }),
//       });

//       if (response.ok) {
//         setSuccessMessage('Puja realizada con éxito.');
//         setBidAmount('');
//         setErrorMessage('');
//       } else {
//         const data = await response.json();
//         if (data.detail) {
//           setErrorMessage(data.detail); // Mostrar el mensaje de error específico
//         } else {
//           setErrorMessage('Error al realizar la puja.');
//         }
//       }
//     } catch (error) {
//       setErrorMessage('Error al conectarse con el servidor.');
//     }
//   };

//   return (
//     <div className="border rounded-lg p-4 shadow-md bg-white">
//       <Image
//         src={product.image}
//         alt={product.name}
//         width={400}
//         height={300}
//         className="w-full h-48 object-cover rounded-md"
//       />

//       <Link href={`/subastas/${auction.id}`}>
//         <h3 className="text-lg font-bold mt-2 cursor-pointer hover:underline">{product.name}</h3>
//       </Link>

//       <p className="text-gray-600">{product.description}</p>
//       <p className="text-gray-800 font-bold mt-2">Precio inicial: ${product.price}</p>
//       <p className="text-sm text-gray-500 mt-1">Inicio: {new Date(start_time).toLocaleString()}</p>
//       <p className="text-sm text-gray-500">Fin: {new Date(end_time).toLocaleString()}</p>

//       <div className="mt-4">
//         <h4 className="font-bold text-gray-700">Historial de Pujas:</h4>
//         <ul className="list-disc list-inside text-gray-600">
//           {currentBids.map((bid, index) => (
//             <li key={index}>
//               Usuario {bid.user}: ${bid.amount} - {new Date(bid.created_at).toLocaleString()}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <form onSubmit={handleBidSubmit} className="mt-4">
//         <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
//           Monto de la Puja:
//         </label>
//         <input
//           type="number"
//           id="bidAmount"
//           value={bidAmount}
//           onChange={(e) => setBidAmount(e.target.value)}
//           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           placeholder="Ingresa tu puja"
//           required
//         />
//         <button
//           type="submit"
//           className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
//         >
//           Realizar Puja
//         </button>
//       </form>

//       {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
//       {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
//     </div>
//   );
// };

// export default AuctionCard;


import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getToken } from '@/utils/auth'; // Importamos la función de manejo del token

const AuctionCard = ({ auction }) => {
  const { product, start_time, end_time, bids } = auction;
  const [bidAmount, setBidAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentBids, setCurrentBids] = useState(bids || []);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/auctions/${auction.id}/`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.amount) {
        setCurrentBids((prevBids) => [
          ...prevBids,
          {
            user: data.user,
            amount: data.amount,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => ws.close();
  }, [auction.id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken(); // Obtiene el token desde la función centralizada

      const response = await fetch(`http://localhost:8000/api/bids/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
        if (data.detail) {
          setErrorMessage(data.detail); // Mostrar el mensaje de error específico
        } else {
          setErrorMessage('Error al realizar la puja.');
        }
      }
    } catch (error) {
      setErrorMessage(error.message); // Manejo de errores generales
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-md"
      />

      <Link href={`/subastas/${auction.id}`}>
        <h3 className="text-lg font-bold mt-2 cursor-pointer hover:underline">{product.name}</h3>
      </Link>

      <p className="text-gray-600">{product.description}</p>
      <p className="text-gray-800 font-bold mt-2">Precio inicial: ${product.price}</p>
      <p className="text-sm text-gray-500 mt-1">Inicio: {new Date(start_time).toLocaleString()}</p>
      <p className="text-sm text-gray-500">Fin: {new Date(end_time).toLocaleString()}</p>

      <div className="mt-4">
        <h4 className="font-bold text-gray-700">Historial de Pujas:</h4>
        <ul className="list-disc list-inside text-gray-600">
          {currentBids.map((bid, index) => (
            <li key={index}>
              Usuario {bid.user}: ${bid.amount} - {new Date(bid.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

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

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
};

export default AuctionCard;
