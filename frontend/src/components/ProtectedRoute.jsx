import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ isPublic = false }) => {
    const token = localStorage.getItem('token');

    // Si la ruta es pública (Login) y ya hay token, mandarlo al dashboard
    if (isPublic && token) {
        return <Navigate to="/pedidos" replace />;
    }

    // Si la ruta es privada y NO hay token, mandarlo al login
    if (!isPublic && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; // Permite renderizar la página hija
};