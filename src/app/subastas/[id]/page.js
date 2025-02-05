// 'use client';

// import { useState, useEffect, useContext } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { AuthContext } from '@/context/AuthContext';
// import { getToken } from '@/utils/auth';
// import io from 'socket.io-client';

// export default function DetallesSubasta() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { user } = useContext(AuthContext);
//   const [auction, setAuction] = useState(null);
//   const [bids, setBids] = useState([]);
//   const [bidAmount, setBidAmount] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);

//   // Obtener detalles de la subasta
//   useEffect(() => {
//     const fetchAuctionDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
//         if (!response.ok) throw new Error('Error al cargar la subasta');
        
//         const data = await response.json();
//         setAuction(data);
//         setBids(data.bids);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuctionDetails();
//   }, [id]);

//   // Configurar WebSocket
//   useEffect(() => {
//     const newSocket = io('http://localhost:8000');
//     setSocket(newSocket);

//     newSocket.on('nueva_puja', (newBid) => {
//       setBids(prev => [...prev, newBid]);
//     });

//     return () => newSocket.disconnect();
//   }, []);

//   // Validar montos de puja
//   const validateBid = (amount) => {
//     const numericAmount = parseFloat(amount);
//     const highestBid = bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0;
    
//     if (numericAmount <= highestBid) {
//       throw new Error(`La puja debe ser mayor que $${highestBid}`);
//     }
//     if (numericAmount < auction.starting_price) {
//       throw new Error(`La puja mínima es $${auction.starting_price}`);
//     }
//   };

//   // Manejar envío de puja
//   const handleBidSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     try {
//       const token = getToken();
//       if (!token) throw new Error('Debes iniciar sesión para pujar');
      
//       validateBid(bidAmount);
      
//       const response = await fetch('http://localhost:8000/api/bids/', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           auction: id,
//           amount: parseFloat(bidAmount)
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Error al realizar la puja');
//       }

//       setBidAmount('');
//       setSuccess('Puja realizada exitosamente!');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Mostrar tiempo restante
//   const calculateTimeLeft = () => {
//     if (!auction) return 'Cargando...';
    
//     const endTime = new Date(auction.end_time);
//     const now = new Date();
//     const difference = endTime - now;

//     if (difference <= 0) return 'Finalizada';

//     const days = Math.floor(difference / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((difference % (1000 * 60)) / 1000);

//     return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//   };

//   if (loading) return <div className="text-center mt-8">Cargando subasta...</div>;
//   if (!auction) return <div className="text-center text-red-500 mt-8">Subasta no encontrada</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">{auction.item_name}</h1>
        
//         <div className="flex flex-col md:flex-row gap-6">
//           <img
//             src={auction.item_image || "/placeholder.png"}
//             alt={auction.item_name}
//             className="w-full md:w-1/2 h-64 object-cover rounded-md"
//           />
          
//           <div className="flex-1 space-y-4">
//             <div className="bg-gray-50 p-4 rounded-md">
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Descripción:</span> {auction.item_description}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Precio inicial:</span> ${auction.starting_price}
//               </p>
//               <p className="text-gray-600 mb-2">
//                 <span className="font-semibold">Creada por:</span> {auction.created_by.email}
//               </p>
//               <p className="text-gray-600">
//                 <span className="font-semibold">Tiempo restante:</span> {calculateTimeLeft()}
//               </p>
//             </div>

//             <form onSubmit={handleBidSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Ingrese su puja:
//                 </label>
//                 <input
//                   type="number"
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                   className="w-full p-2 border rounded-md"
//                   step="0.01"
//                   min={auction.starting_price}
//                   required
//                 />
//               </div>
              
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               {success && <p className="text-green-500 text-sm">{success}</p>}
              
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Realizar puja
//               </button>
//             </form>

//             <div className="bg-gray-50 p-4 rounded-md">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de pujas</h2>
//               <div className="space-y-2">
//                 {bids.length === 0 ? (
//                   <p className="text-gray-500 text-center">No hay pujas aún</p>
//                 ) : (
//                   bids.map((bid) => (
//                     <div key={bid.id} className="bg-white p-3 rounded-md shadow-sm">
//                       <p className="text-gray-600">
//                         <span className="font-semibold">{bid.user}</span> ofreció $
//                         {bid.amount} el {new Date(bid.created_at).toLocaleString()}
//                       </p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

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

  // Obtener detalles de la subasta
  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`);
        if (!response.ok) throw new Error('Error al cargar la subasta');
        
        const data = await response.json();
        setAuction(data);
        setBids(data.bids);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  // Configurar WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/auctions/${id}/`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const newBid = JSON.parse(event.data);
      setBids((prev) => [...prev, newBid]);
    };

    return () => ws.close();
  }, [id]);

  // Manejar envío de puja
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('No hay conexión WebSocket');
      }

      if (!user) throw new Error('Debes iniciar sesión para pujar');

      const numericAmount = parseFloat(bidAmount);
      if (numericAmount <= (bids.length > 0 ? Math.max(...bids.map(b => b.amount)) : 0)) {
        throw new Error('Debes pujar más alto');
      }

      socket.send(JSON.stringify({ amount: numericAmount, user: user.email }));
      setBidAmount('');
      setSuccess('Puja enviada correctamente');
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
              <p className="text-gray-600"><span className="font-semibold">Descripción:</span> {auction.item_description}</p>
              <p className="text-gray-600"><span className="font-semibold">Precio inicial:</span> ${auction.starting_price}</p>
              <p className="text-gray-600"><span className="font-semibold">Tiempo restante:</span> {new Date(auction.end_time).toLocaleString()}</p>
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
