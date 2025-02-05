"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Si aún se está cargando, mostramos un mensaje.
  if (loading) {
    return <p className="text-center mt-8">Cargando perfil...</p>;
  }

  // Si no hay usuario (no está autenticado), redirigimos al login.
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // En este ejemplo se asume que el objeto user contiene:
  // email, full_name, phone y address.
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mi Perfil</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Nombre Completo:</strong> {user.full_name || "No especificado"}
        </p>
        <p>
          <strong>Teléfono:</strong> {user.phone || "No especificado"}
        </p>
        <p>
          <strong>Dirección:</strong> {user.address || "No especificado"}
        </p>
      </div>
      <button
        onClick={() => router.push("/perfil/editar")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Editar Perfil
      </button>
    </div>
  );
}
