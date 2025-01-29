'use client';

import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function NuevaSubastaPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    product: '',
    start_time: '',
    end_time: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirige al login si no hay un usuario autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión.');
      }

      const response = await fetch('http://localhost:8000/api/auctions/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear la subasta.');
      }

      setSuccess(true);
      alert('Subasta creada con éxito.');
      router.push('/subastas');
    } catch (err) {
      console.error('Error al crear la subasta:', err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Cargando...</p>; // Estado de carga mientras se verifica la autenticación
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Crear Nueva Subasta</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Subasta creada exitosamente.</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product" className="block text-sm font-medium mb-1">
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
          <label htmlFor="start_time" className="block text-sm font-medium mb-1">
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
          <label htmlFor="end_time" className="block text-sm font-medium mb-1">
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
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Crear Subasta
        </button>
      </form>
    </div>
  );
}
