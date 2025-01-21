// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { useParams } from 'next/navigation';
// // import AuctionCard from '@/components/AuctionCard';

// // export default function SubastaDetalle() {
// //   const { id } = useParams();

// //   const [auction, setAuction] = useState(null);

// //   useEffect(() => {
// //     if (id) {
// //       fetch(`http://localhost:8000/api/auctions/${id}/`)
// //         .then((res) => res.json())
// //         .then((data) => setAuction(data))
// //         .catch((err) => console.error(err));
// //     }
// //   }, [id]);

// //   if (!auction) {
// //     return <p>Cargando subasta...</p>;
// //   }

// //   return (
// //     <div className="p-6">
// //       <AuctionCard auction={auction} />
// //     </div>
// //   );
// // }


// // src/app/subastas/[id].js
// 'use client';

// import { useEffect, useState } from 'react';
// import AuctionCard from '@/components/AuctionCard';

// const AuctionPage = ({ params }) => {
//   const { id } = params;
//   const [auction, setAuction] = useState(null);

//   useEffect(() => {
//     // Llamada al backend para obtener la subasta específica
//     fetch(`http://localhost:8000/api/auctions/${id}/`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAuction(data);
//       })
//       .catch((err) => console.error(err));
//   }, [id]);

//   if (!auction) {
//     return <p>Cargando...</p>;
//   }

//   return (
//     <main className="min-h-screen bg-gray-100 p-6">
//       <AuctionCard auction={auction} />
//     </main>
//   );
// };

// export default AuctionPage;
