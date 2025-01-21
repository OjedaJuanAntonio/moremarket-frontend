"use client";

import { AuthProvider } from '../context/AuthContext';
import '../app/globals.css'; // Importar estilos globales, si corresponde

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}
