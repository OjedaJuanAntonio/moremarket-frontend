'use client';

import { useState } from 'react';

export default function NuevaSubastaPage() {
  const [formData, setFormData] = useState({
    product: '',
    start_time: '',
    end_time: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Por favor, inicia sesión primero.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auctions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Subasta creada con éxito.');
      } else {
        alert('Error al crear la subasta.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la subasta.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-4">Crear Nueva Subasta</h1>
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
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Crear Subasta
        </button>
      </form>
    </div>
  );
}
