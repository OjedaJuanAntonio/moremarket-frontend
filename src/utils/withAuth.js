import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const { user, loading } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login');
            }
        }, [user, loading]);

        if (loading || !user) {
            return <p>Cargando...</p>; // Opcional: Spinner de carga
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
