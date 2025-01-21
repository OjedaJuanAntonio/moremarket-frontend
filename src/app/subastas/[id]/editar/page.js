'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/utils/auth'; // Importa la función de manejo del token

export default function EditarSubastaPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [formData, setFormData] = useState({
    product: '',
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    try {
      const token = getToken(); // Usamos la función centralizada para obtener el token

      // Obtener los datos de la subasta
      fetch(`http://localhost:8000/api/auctions/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al cargar los datos de la subasta.');
          }
          return res.json();
        })
        .then((data) => {
          setFormData({
            product: data.product.name,
            start_time: new Date(data.start_time).toISOString().slice(0, 16),
            end_time: new Date(data.end_time).toISOString().slice(0, 16),
          });
        })
        .catch((err) => {
          console.error(err);
          alert('Error al cargar la subasta.');
        });
    } catch (err) {
      alert(err.message);
    }
  }, [id]);

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
        alert('Error al actualizar la subasta.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar la subasta.');
    }
  };

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
