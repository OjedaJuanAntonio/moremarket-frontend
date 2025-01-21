"use client";

import { AuthProvider } from '../context/AuthContext';
import LoginPage from './login';

export default function TestLogin() {
    return (
        <AuthProvider>
            <LoginPage />
        </AuthProvider>
    );
}
