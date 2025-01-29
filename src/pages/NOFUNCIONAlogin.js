// // "use client";

// // import { useState, useContext } from 'react';
// // import { AuthContext } from '../context/AuthContext';
// // import { useRouter } from 'next/navigation';

// // export default function LoginPage() {
// //     const authContext = useContext(AuthContext);
// //     const { login, isAuthenticated } = authContext || {}; // Verificar el estado de autenticación y función de login
// //     const router = useRouter();

// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [error, setError] = useState('');

// //     // Manejar el envío del formulario
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         try {
// //             if (login) {
// //                 await login(email, password);
// //                 router.push('/'); // Redirigir al inicio después del login exitoso
// //             } else {
// //                 setError('Error: Contexto de autenticación no disponible.');
// //             }
// //         } catch (err) {
// //             setError('Credenciales inválidas o error del servidor.');
// //         }
// //     };

// //     // Si ya está autenticado, redirigir al usuario
// //     if (isAuthenticated) {
// //         router.push('/'); // Cambiar esta ruta si necesitas un redireccionamiento diferente
// //         return null; // Evita renderizar el formulario si el usuario ya está autenticado
// //     }

// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //             <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
// //                 <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
// //                 {error && <p className="text-red-500 mb-4">{error}</p>}
// //                 <div className="mb-4">
// //                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
// //                         Correo Electrónico
// //                     </label>
// //                     <input
// //                         type="email"
// //                         id="email"
// //                         value={email}
// //                         onChange={(e) => setEmail(e.target.value)}
// //                         required
// //                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
// //                     />
// //                 </div>
// //                 <div className="mb-4">
// //                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
// //                         Contraseña
// //                     </label>
// //                     <input
// //                         type="password"
// //                         id="password"
// //                         value={password}
// //                         onChange={(e) => setPassword(e.target.value)}
// //                         required
// //                         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
// //                     />
// //                 </div>
// //                 <button
// //                     type="submit"
// //                     className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
// //                 >
// //                     Iniciar Sesión
// //                 </button>
// //             </form>
// //         </div>
// //     );
// // }

// "use client";

// import { useState, useContext } from "react";
// import { AuthContext } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const authContext = useContext(AuthContext);

//   console.log("AuthContext value en LoginPage:", authContext);



//   if (!authContext) {
//     console.error("AuthContext no está disponible.");
//     return <p>Error: El contexto de autenticación no está disponible.</p>;
//   }

//   const { login, user, loading } = authContext;
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await login(email, password);
//       router.push("/");
//     } catch (err) {
//       setError("Credenciales inválidas o error del servidor.");
//     }
//   };

//   if (loading) return <p>Cargando...</p>;
//   if (user) {
//     router.push("/");
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-md"
//       >
//         <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <div className="mb-4">
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Correo Electrónico
//           </label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//           />
//         </div>
//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Contraseña
//           </label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//         >
//           Iniciar Sesión
//         </button>
//       </form>
//     </div>
//   );
// }
