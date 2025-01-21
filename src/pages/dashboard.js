import withAuth from "../utils/withAuth";
import LogoutButton from "../components/LogoutButton";

const Dashboard = () => {
    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>
            <p>¡Aquí puedes ver información protegida!</p>
            <LogoutButton /> {/* Agrega el botón de logout */}
        </div>
    );
};

export default withAuth(Dashboard);
