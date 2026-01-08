import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            // Simulamos un pequeño delay para que la animación se aprecie
            setTimeout(() => navigate('/pedidos'), 800);
        } catch (err) {
            setError('Credenciales incorrectas.');
            setIsLoading(false);
        }
    };

    return (

        <div
            className="min-h-screen w-full flex items-center justify-center bg-[url('https://www.acity.com.pe/wp-content/uploads/2023/02/mesas-de-casino-blackjack-peru-1-scaled.webp')] bg-cover bg-center bg-no-repeat bg-black/60 bg-blend-overlay px-4"
        >
            <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-700 p-3 rounded-full mb-4 shadow-lg">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Atlantic City Challenge</h2>
                    <p className="text-gray-600 text-sm mt-2">Portal de Pedidos!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="ej. seguridad@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>Ingresar al Sistema</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}