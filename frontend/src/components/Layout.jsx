import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ShoppingCart, Users, LogOut, ShieldCheck, UserCircle, Loader2 } from 'lucide-react';

export default function Layout({ children }) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post('/auth/logout');
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/login', { replace: true });
            }, 800);
        } catch (error) {
            localStorage.removeItem('token');
            navigate('/login', { replace: true });
        }
    };

    // Función auxiliar para clases de enlaces activos
    const linkClass = (path) =>
        `flex items-center gap-3 p-3 rounded-lg transition-all ${location.pathname === path
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
            : 'hover:bg-slate-800 text-slate-400'
        }`;

    return (
        <div className="flex h-screen bg-slate-50 relative">
            {isLoggingOut && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm transition-all duration-500">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                    <h2 className="text-white text-xl font-medium tracking-tight">Cerrando sesión de forma segura...</h2>
                    <p className="text-slate-400 text-sm mt-2">Invalidando credenciales en Atlantic City</p>
                </div>
            )}

            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                    <ShieldCheck className="text-blue-400" />
                    <span className="font-bold text-lg tracking-tight">ACity Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link to="/pedidos" className={linkClass('/pedidos')}>
                        <ShoppingCart size={20} /> Pedidos
                    </Link>
                    {/* Ahora Usuarios se resaltará correctamente */}
                    <Link to="/usuarios" className={linkClass('/usuarios')}>
                        <Users size={20} /> Usuarios
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer font-medium disabled:opacity-50"
                    >
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="text-slate-600 font-semibold uppercase text-xs tracking-widest">Dashboard</h2>
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                        <UserCircle size={20} className="text-blue-600" />
                        <span>Seguridad</span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}