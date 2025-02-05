// "use client";

// import { useState, useEffect, useContext } from "react";
// import { AuthContext } from "@/context/AuthContext";
// import Link from "next/link";

// export default function MisSubastasPage() {
//   const { user, loading } = useContext(AuthContext);
//   const [auctions, setAuctions] = useState([]);
//   const [error, setError] = useState("");
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     async function fetchAuctions() {
//       try {
//         const response = await fetch("http://localhost:8000/api/auctions/");
//         if (!response.ok) {
//           throw new Error("Error al obtener las subastas");
//         }
//         const data = await response.json();
//         // Filtra las subastas creadas por el usuario autenticado.
//         const misSubastas = data.filter(
//           (auction) =>
//             auction.created_by && auction.created_by.id === user.id
//         );
//         setAuctions(misSubastas);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setFetching(false);
//       }
//     }

//     if (user) {
//       fetchAuctions();
//     }
//   }, [user]);

//   if (loading || fetching) {
//     return <p className="text-center mt-8">Cargando mis subastas...</p>;
//   }

//   if (!user) {
//     return (
//       <p className="text-center mt-8 text-red-500">
//         Debes iniciar sesión para ver tus subastas.
//       </p>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">Mis Subastas</h1>
//       {error && (
//         <p className="text-center text-red-500 mb-4">{error}</p>
//       )}
//       {auctions.length > 0 ? (
//         <ul className="space-y-4">
//           {auctions.map((auction) => (
//             <li key={auction.id} className="p-4 bg-white rounded shadow">
//               <h2 className="text-xl font-semibold">{auction.item_name}</h2>
//               <p className="text-gray-600">
//                 Precio inicial: ${auction.starting_price}
//               </p>
//               <p className="text-gray-600">
//                 Fecha de inicio:{" "}
//                 {new Date(auction.start_time).toLocaleString()}
//               </p>
//               <p className="text-gray-600">
//                 Fecha de fin:{" "}
//                 {new Date(auction.end_time).toLocaleString()}
//               </p>
//               <Link href={`/subastas/${auction.id}`}>
//                 <a className="text-blue-500 hover:underline">Ver Detalles</a>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-center text-gray-600">
//           No tienes subastas creadas.
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function MisSubastasPage() {
  const { user, loading } = useContext(AuthContext);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [expiredAuctions, setExpiredAuctions] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchAuctions() {
      try {
        const response = await fetch("http://localhost:8000/api/auctions/");
        if (!response.ok) {
          throw new Error("Error al obtener las subastas");
        }
        const data = await response.json();

        // Obtener fecha actual
        const now = new Date();

        // Filtra subastas activas y caducadas del usuario autenticado
        const misSubastas = data.filter(
          (auction) => auction.created_by && auction.created_by.id === user.id
        );

        const activas = misSubastas.filter(
          (auction) => new Date(auction.end_time) > now
        );
        const caducadas = misSubastas.filter(
          (auction) => new Date(auction.end_time) <= now
        );

        setActiveAuctions(activas);
        setExpiredAuctions(caducadas);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }

    if (user) {
      fetchAuctions();
    }
  }, [user]);

  if (loading || fetching) {
    return <p className="text-center mt-8">Cargando mis subastas...</p>;
  }

  if (!user) {
    return (
      <p className="text-center mt-8 text-red-500">
        Debes iniciar sesión para ver tus subastas.
      </p>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mis Subastas</h1>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Subastas Activas */}
      <h2 className="text-2xl font-semibold mt-6">Subastas Activas</h2>
      {activeAuctions.length > 0 ? (
        <ul className="space-y-4">
          {activeAuctions.map((auction) => (
            <li key={auction.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">{auction.item_name}</h2>
              <p className="text-gray-600">
                Precio inicial: ${auction.starting_price}
              </p>
              <p className="text-gray-600">
                Finaliza el: {new Date(auction.end_time).toLocaleString()}
              </p>
              <Link href={`/subastas/${auction.id}`}>
                <a className="text-blue-500 hover:underline">Ver Detalles</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No tienes subastas activas.</p>
      )}

      {/* Subastas Finalizadas */}
      <h2 className="text-2xl font-semibold mt-6">Subastas Finalizadas</h2>
      {expiredAuctions.length > 0 ? (
        <ul className="space-y-4">
          {expiredAuctions.map((auction) => (
            <li key={auction.id} className="p-4 bg-gray-200 rounded shadow">
              <h2 className="text-xl font-semibold">{auction.item_name}</h2>
              <p className="text-gray-600">
                Precio final: ${auction.starting_price}
              </p>
              <p className="text-gray-600">
                Finalizó el: {new Date(auction.end_time).toLocaleString()}
              </p>
              <Link href={`/subastas/${auction.id}`}>
                <a className="text-blue-500 hover:underline">Ver Detalles</a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No tienes subastas finalizadas.</p>
      )}
    </div>
  );
}
