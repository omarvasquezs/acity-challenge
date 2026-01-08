import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';
import { X, Loader2, Edit, Trash2, UserPlus, Shield, Lock, RefreshCw } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: 'User',
        password: ''
    });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/usuarios');
            setUsers(response.data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/registrar', formData);
            setShowModal(false);
            setFormData({ nombre: '', email: '', rol: 'User', password: '' });
            fetchUsers();
        } catch (error) {
            console.error("Error al crear usuario:", error.response?.data);
            alert("Error al registrar: Verifique que el correo no esté en uso.");
        }
    };

    // NUEVA FUNCIÓN: Eliminar Usuario físicamente de la BD
    const handleDelete = async (id, nombre) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"? Esta acción es permanente.`)) {
            try {
                // Llama al endpoint DELETE /api/usuarios/{id}
                await api.delete(`/usuarios/${id}`);
                fetchUsers(); // Recarga la tabla tras borrar
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar al usuario. Verifique sus permisos de Administrador.");
            }
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Usuarios</h2>
                    <p className="text-slate-500 text-sm italic">Administración de accesos Atlantic City.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchUsers}
                        className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer transition-all"
                        title="Refrescar lista"
                    >
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <UserPlus size={20} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="p-5">Nombre</th>
                            <th className="p-5">Email</th>
                            <th className="p-5">Rol</th>
                            <th className="p-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="p-20 text-center">
                                    <Loader2 className="animate-spin inline text-blue-600" size={32} />
                                    <p className="mt-2 text-slate-400 font-medium">Cargando personal...</p>
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u.id || u.email} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="p-5 font-semibold text-slate-700">{u.nombre}</td>
                                    <td className="p-5 text-slate-500">{u.email}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className={u.rol === 'Admin' ? 'text-amber-500' : 'text-blue-500'} />
                                            <span className={`text-sm font-bold ${u.rol === 'Admin' ? 'text-amber-700' : 'text-slate-600'}`}>
                                                {u.rol}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-all">
                                                <Edit size={18} />
                                            </button>

                                            {/* BOTÓN ELIMINAR CONECTADO */}
                                            <button
                                                onClick={() => handleDelete(u.id, u.nombre)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-all"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-20 text-center">
                                    <div className="flex flex-col items-center opacity-50">
                                        <UserPlus size={48} className="text-slate-300 mb-2" />
                                        <p className="text-slate-500 font-medium italic">No hay usuarios registrados.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">Registrar Nuevo Acceso</h3>
                            <button onClick={() => setShowModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600 p-1">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                                <input
                                    type="text" required
                                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email" required
                                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-slate-300" size={18} />
                                    <input
                                        type="password" required
                                        minLength={6}
                                        placeholder="Mínimo 6 caracteres"
                                        className="w-full border border-slate-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Rol del Sistema</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer transition-all"
                                    value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    <option value="Admin">Admin (Control Total)</option>
                                    <option value="User">User (Operador)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 cursor-pointer shadow-lg active:scale-95 transition-all">
                                Crear Usuario
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}