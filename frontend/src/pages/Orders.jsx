import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';
import { Plus, X, Loader2, Edit, Trash2, RefreshCw, ClipboardList } from 'lucide-react';

// Hardcodeo de opciones para el select (Mapeado a la nueva columna Descripcion)
const OPCIONES_PEDIDOS = [
    { id: 1, nombre: "Mesa Blackjack 01", precio: 500.00 },
    { id: 2, nombre: "Ruleta Europea 05", precio: 250.75 },
    { id: 3, nombre: "Póker Texas Holdem 10", precio: 1000.00 },
    { id: 4, nombre: "Baccarat VIP 02", precio: 1500.50 },
];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Estado inicial ajustado al nuevo DTO del backend
    const [formData, setFormData] = useState({
        cliente: '',
        descripcion: '', // Reemplaza a numeroPedido en el formulario
        total: 0,
        estado: 'Registrado'
    });

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/pedidos');
            setOrders(response.data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (order) => {
        setEditingId(order.id);
        setFormData({
            cliente: order.cliente,
            descripcion: order.descripcion || '',
            total: order.total,
            estado: order.estado
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`¿Seguro que deseas eliminar el registro #${id}?`)) {
            try {
                await api.delete(`/pedidos/${id}`);
                fetchOrders();
            } catch (error) {
                alert("Error al eliminar el registro.");
            }
        }
    };

    const handlePedidoChange = (e) => {
        const nombreMesa = e.target.value;
        const opcion = OPCIONES_PEDIDOS.find(opt => opt.nombre === nombreMesa);

        setFormData({
            ...formData,
            descripcion: nombreMesa, // Guardamos el nombre de la mesa
            total: opcion ? opcion.precio : 0
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // El payload ahora coincide con CreatePedidoRequest del backend
            const payload = {
                cliente: formData.cliente,
                total: parseFloat(formData.total),
                descripcion: formData.descripcion // Campo clave para evitar el Error 400
            };

            if (editingId) {
                await api.put(`/pedidos/${editingId}`, { ...payload, id: editingId, estado: formData.estado });
            } else {
                // En creación, el backend autogenera el NumeroPedido
                await api.post('/pedidos', payload);
            }

            closeModal();
            fetchOrders();
        } catch (error) {
            // Log detallado para depurar validaciones de .NET
            console.error("Detalles del error 400:", error.response?.data);
            alert("Error de validación: Verifique los campos enviados.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ cliente: '', descripcion: '', total: 0, estado: 'Registrado' });
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Pedidos</h2>
                    <p className="text-slate-500 text-sm italic">Administración centralizada con autogeneración de códigos.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchOrders} className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="cursor-pointer bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                    >
                        <Plus size={20} /> Nuevo Pedido
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="p-5">Código</th>
                            <th className="p-5">Cliente</th>
                            <th className="p-5">Mesa / Descripción</th>
                            <th className="p-5">Estado</th>
                            <th className="p-5 text-right">Total</th>
                            <th className="p-5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="p-20 text-center">
                                    <Loader2 className="animate-spin inline text-blue-600" size={32} />
                                    <p className="mt-2 text-slate-400 font-medium">Sincronizando...</p>
                                </td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="p-5 font-mono text-blue-600 font-medium">{o.numeroPedido}</td>
                                    <td className="p-5 font-semibold text-slate-700">{o.cliente}</td>
                                    <td className="p-5 text-slate-500">{o.descripcion || 'Sin descripción'}</td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                            {o.estado}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-bold text-slate-900">S/ {parseFloat(o.total || 0).toFixed(2)}</td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleEdit(o)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(o.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-24 text-center">
                                    <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-slate-800">No hay pedidos registrados</h3>
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
                                {editingId ? 'Editar Pedido' : 'Registrar Nuevo Pedido'}
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Cliente</label>
                                <input
                                    type="text" required
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.cliente}
                                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Seleccionar Mesa</label>
                                <select
                                    required
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white"
                                    value={formData.descripcion}
                                    onChange={handlePedidoChange}
                                >
                                    <option value="">Seleccione mesa...</option>
                                    {OPCIONES_PEDIDOS.map(opt => (
                                        <option key={opt.id} value={opt.nombre}>{opt.nombre} - S/ {opt.precio}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Monto Total</label>
                                <input
                                    type="text" readOnly
                                    className="w-full border border-slate-100 bg-slate-50 text-slate-500 rounded-xl p-3 font-black text-lg"
                                    value={`S/ ${formData.total.toFixed(2)}`}
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg active:scale-95 transition-all">
                                {editingId ? 'Actualizar Registro' : 'Guardar Registro'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}