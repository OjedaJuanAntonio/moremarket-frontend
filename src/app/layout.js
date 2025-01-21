"use client";

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({ children }) {
    console.log(AuthProvider); // Esto debe mostrar una función en la consola
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
