import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Plus, X, Loader2, Edit, Trash2, RefreshCw, UserCheck, ShieldCheck, Users as UsersIcon } from 'lucide-react';

// Ajustado a solo dos roles según el requerimiento
const ROLES = ["Admin", "User"];

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rol: 'User', // Valor por defecto ajustado
        password: ''
    });

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/usuarios');
            setUsers(response.data);
        } catch (error) {
            toast.error("Error al sincronizar lista de usuarios");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            password: ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`¿Seguro que deseas dar de baja al usuario #${id}?`)) {
            try {
                await api.delete(`/usuarios/${id}`);
                toast.success('Usuario eliminado correctamente');
                fetchUsers();
            } catch (error) {
                toast.error('No se pudo completar la eliminación');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const operation = editingId
            ? api.put(`/usuarios/${editingId}`, { ...formData, id: editingId })
            : api.post('/usuarios/registrar', formData);

        toast.promise(operation, {
            loading: 'Actualizando directorio...',
            success: editingId ? '¡Perfil actualizado!' : '¡Usuario registrado con éxito!',
            error: (err) => `Error: ${err.response?.data?.message || 'Error en el servidor'}`,
        });

        try {
            await operation;
            closeModal();
            fetchUsers();
        } catch (error) {
            console.error("Detalles técnicos:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ nombre: '', email: '', rol: 'User', password: '' });
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Usuarios</h2>
                    <p className="text-slate-500 text-sm italic">Control de accesos y perfiles del sistema Atlantic City.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchUsers} className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer bg-slate-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-slate-200 transition-all hover:bg-slate-900 active:scale-95"
                    >
                        <Plus size={20} /> Nuevo Usuario
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="p-5">Usuario</th>
                            <th className="p-5">Email</th>
                            <th className="p-5">Rol / Permisos</th>
                            <th className="p-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" className="p-20 text-center">
                                    <Loader2 className="animate-spin inline text-slate-600" size={32} />
                                    <p className="mt-2 text-slate-400 font-medium">Cargando directorio...</p>
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="p-5 flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-lg text-slate-500">
                                            <UserCheck size={18} />
                                        </div>
                                        <span className="font-semibold text-slate-700">{u.nombre}</span>
                                    </td>
                                    <td className="p-5 text-slate-500 font-medium">{u.email}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit border ${u.rol === 'Admin'
                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            <ShieldCheck size={12} /> {u.rol.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(u)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(u.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-24 text-center">
                                    <UsersIcon className="mx-auto text-slate-200 mb-4" size={56} />
                                    <h3 className="text-xl font-bold text-slate-800">No hay usuarios registrados</h3>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800">
                                {editingId ? 'Editar Perfil' : 'Nuevo Colaborador'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                                <input
                                    type="text" required
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email" required
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Cada campo en su propia fila vertical */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Rol de Acceso</label>
                                <select
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 bg-white"
                                    value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder={editingId ? "Dejar en blanco para no cambiar" : "****"}
                                    required={!editingId}
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-900 shadow-lg active:scale-95 transition-all">
                                {editingId ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}