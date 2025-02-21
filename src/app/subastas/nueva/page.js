  'use client';

  import { useState, useContext, useEffect, useCallback } from 'react';
  import { useRouter } from 'next/navigation';
  import { AuthContext } from '@/context/AuthContext';

  export default function NuevaSubastaPage() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    const [formData, setFormData] = useState({
      item_name: '',       // Nuevo campo: Nombre del artículo
      starting_price: '',  // Nuevo campo: Precio inicial
      start_time: '',      // Fecha de inicio
      end_time: '',        // Fecha de fin
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirige al login si no hay un usuario autenticado
    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    // Maneja los cambios en el formulario
    const handleChange = useCallback((e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }, []);

    // Valida las fechas
    const validateDates = useCallback(() => {
      const start = new Date(formData.start_time);
      const end = new Date(formData.end_time);
      return start < end;
    }, [formData.start_time, formData.end_time]);

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess(false);
      setIsSubmitting(true);

      try {
        // Validar fechas
        if (!validateDates()) {
          throw new Error('La fecha de inicio debe ser anterior a la fecha de fin.');
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión.');
        }

        // Formatear fechas
        const formattedData = {
          ...formData,
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString(),
          starting_price: parseFloat(formData.starting_price), // Convertir a número
        };

        console.log('Datos enviados:', JSON.stringify(formattedData));

        const response = await fetch('http://localhost:8000/api/auctions/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error del backend:', errorData);
          throw new Error(JSON.stringify(errorData));
        }

        setSuccess(true);
        alert('Subasta creada con éxito.');
        router.push('/subastas');
      } catch (err) {
        console.error('Error al crear la subasta:', err.message);
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    };

    if (loading) {
      return <p className="text-center mt-8">Cargando...</p>;
    }

    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-6">Crear Nueva Subasta</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Subasta creada exitosamente.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="item_name" className="block text-sm font-medium text-gray-700">
                Nombre del Artículo
              </label>
              <input
                type="text"
                id="item_name"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="starting_price" className="block text-sm font-medium text-gray-700">
                Precio Inicial
              </label>
              <input
                type="number"
                id="starting_price"
                name="starting_price"
                value={formData.starting_price}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
              >
                {isSubmitting ? 'Creando...' : 'Crear Subasta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }