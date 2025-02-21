"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export default function ChatRoomPage() {
  const { room } = useParams(); // Extrae el nombre de la sala de la URL
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    // Construir la URL del WebSocket usando el parámetro de la sala
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${room}/`);
    socket.onopen = () => {
      console.log("WebSocket conectado");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };
    socket.onclose = (event) => {
      console.log("WebSocket cerrado:", event);
    };
    wsRef.current = socket;
    return () => {
      socket.close();
    };
  }, [room]);

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Puedes enviar el sender según tu lógica (por ejemplo, del AuthContext)
      const messageData = { message: input, sender: "Anon" };
      wsRef.current.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sala de Chat: {room}</h1>
      <div className="border p-4 h-80 overflow-y-scroll mb-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">{msg.sender}: </span>
              <span>{msg.message}</span>
            </div>
          ))
        ) : (
          <p>No hay mensajes aún.</p>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 ml-2"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
