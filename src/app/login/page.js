"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/"); // Redirigir a la página principal después del login
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.detail || "Credenciales inválidas.");
      } else {
        setError("Error al conectar con el servidor.");
      }
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando...</p>;
  if (user) {
    router.push("/"); // Redirigir si el usuario ya está autenticado
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Por favor, introduce tus credenciales para continuar.
        </p>
        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold disabled:bg-blue-400"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-6">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}