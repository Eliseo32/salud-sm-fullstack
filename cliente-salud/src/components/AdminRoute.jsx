import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, token } = useAuth();

    if (!token) {
        // Si no está logueado, fuera
        return <Navigate to="/login" />;
    }

    if (user && user.rol !== 'admin') {
        // Si está logueado pero NO es admin, fuera
        return <Navigate to="/" />;
    }

    // Si está logueado Y es admin, muestra la página
    return children;
};

export default AdminRoute;
