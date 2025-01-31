// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getToken } from '@/utils/auth'; // Importa la función de manejo del token

// export default function EditarSubastaPage({ params }) {
//   const router = useRouter();
//   const { id } = params;
//   const [formData, setFormData] = useState({
//     product: '',
//     start_time: '',
//     end_time: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isCreator, setIsCreator] = useState(false); // Estado para verificar si el usuario es el creador

//   useEffect(() => {
//     const fetchAuctionDetails = async () => {
//       try {
//         const token = getToken(); // Usamos la función centralizada para obtener el token

//         // Obtener los datos de la subasta
//         const response = await fetch(`http://localhost:8000/api/auctions/${id}/`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Error al cargar los datos de la subasta.');
//         }

//         const data = await response.json();

//         // Verificar si el usuario actual es el creador de la subasta
//         const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario actual
//         if (user?.id !== data.created_by.id) {
//           setError('No tienes permiso para editar esta subasta.');
//           setIsCreator(false);
//         } else {
//           setIsCreator(true);
//           setFormData({
//             product: data.product.name,
//             start_time: new Date(data.start_time).toISOString().slice(0, 16),
//             end_time: new Date(data.end_time).toISOString().slice(0, 16),
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error al cargar la subasta.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAuctionDetails();
//   }, [id]);
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/auth';

export default function EditarSubastaPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [formData, setFormData] = useState({
    product: '',
    start_time: '',
    end_time: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:8000/api/auctions/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Error al cargar la subasta');
        }

        const data = await response.json();
        const user = JSON.parse(localStorage.getItem('user'));

        // Verificación 1: Usuario existe
        if (!user) {
          setError('Debes iniciar sesión');
          router.push('/login');
          return;
        }

        // Verificación 2: Comparación de IDs
        const isCreator = user.id === data.created_by?.id; // Usar optional chaining
        setIsCreator(isCreator);

        if (!isCreator) {
          setError('No tienes permiso');
          return;
        }

        // Actualizar formulario
        setFormData({
          product: data.product?.name || '',
          start_time: new Date(data.start_time).toISOString().slice(0, 16),
          end_time: new Date(data.end_time).toISOString().slice(0, 16),
        });

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        if (err.message.includes('Token')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id, router]);

  // ... (resto del código sin cambios)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = getToken(); // Usamos la función centralizada para obtener el token

      const response = await fetch(`http://localhost:8000/api/auctions/${id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Subasta actualizada con éxito.');
        router.push('/subastas');
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Error al actualizar la subasta.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar la subasta.');
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando subasta...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!isCreator) return <p className="text-center text-red-500 mt-8">No tienes permiso para editar esta subasta.</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Editar Subasta</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="product">
            Producto
          </label>
          <input
            type="text"
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="start_time">
            Fecha de Inicio
          </label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="end_time">
            Fecha de Fin
          </label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Actualizar Subasta
        </button>
      </form>
    </div>
  );
}