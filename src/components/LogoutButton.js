import { useRouter } from "next/router";

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Eliminar los tokens de localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Redirigir al usuario a la pantalla de login
        router.push("/login");
    };

    return <button onClick={handleLogout}>Cerrar Sesión</button>;
};

export default LogoutButton;
