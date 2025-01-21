// frontend/pages/profile.js
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';
import { logout } from '../utils/auth';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await fetchData('/api/users/profile/', 'GET', null, true);
                setUser(data);
            } catch (error) {
                logout(); // Redirige al login si el token expira
            }
        };
        fetchProfile();
    }, []);

    if (!user) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Perfil</h1>
            <p>Email: {user.email}</p>
            <p>Nombre completo: {user.full_name}</p>
            <p>Teléfono: {user.phone}</p>
            <p>Dirección: {user.address}</p>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default Profile;
