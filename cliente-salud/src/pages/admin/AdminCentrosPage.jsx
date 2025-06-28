import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminCentrosPage() {
    const { token } = useAuth();
    const [centros, setCentros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentCentro, setCurrentCentro] = useState(null); // Para editar

    const fetchCentros = async () => {
        try {
            const response = await apiClient.get('/centros');
            setCentros(response.data);
        } catch (error) {
            console.error("Error al obtener los centros", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCentros();
    }, []);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este centro?')) {
            try {
                await apiClient.delete(`/centros/${id}`, config);
                fetchCentros(); // Recargar la lista
            } catch (error) {
                console.error("Error al eliminar el centro", error);
                alert('No se pudo eliminar el centro.');
            }
        }
    };

    const handleSave = async (centroData) => {
        try {
            if (currentCentro) {
                // Actualizar
                await apiClient.put(`/centros/${currentCentro.id}`, centroData, config);
            } else {
                // Crear
                await apiClient.post('/centros', centroData, config);
            }
            fetchCentros(); // Recargar
            setShowModal(false); // Cerrar modal
            setCurrentCentro(null); // Limpiar
        } catch (error) {
            console.error("Error al guardar el centro", error);
            alert('No se pudo guardar el centro.');
        }
    };

    const openModalToCreate = () => {
        setCurrentCentro(null);
        setShowModal(true);
    };

    const openModalToEdit = (centro) => {
        setCurrentCentro(centro);
        setShowModal(true);
    };

    if (loading) return <p className="text-white text-center mt-8">Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Gestionar Centros de Salud</h1>
            <div className="flex justify-end mb-4">
                <button onClick={openModalToCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    Añadir Nuevo Centro
                </button>
            </div>

            {/* Tabla de Centros */}
            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Dirección</th>
                            <th className="p-3">Teléfono</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {centros.map(centro => (
                            <tr key={centro.id} className="border-b border-gray-700">
                                <td className="p-3">{centro.nombre}</td>
                                <td className="p-3">{centro.direccion}</td>
                                <td className="p-3">{centro.telefono}</td>
                                <td className="p-3">
                                    <button onClick={() => openModalToEdit(centro)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2">Editar</button>
                                    <button onClick={() => handleDelete(centro.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para Crear/Editar */}
            {showModal && <CentroFormModal initialData={currentCentro} onSave={handleSave} onClose={() => setShowModal(false)} />}
        </div>
    );
}

// Componente del Formulario en un Modal
function CentroFormModal({ initialData, onSave, onClose }) {
    const [formData, setFormData] = useState(initialData || {
        nombre: '', direccion: '', telefono: '', horarios: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-lg">
                <h2 className="text-2xl text-white mb-4">{initialData ? 'Editar' : 'Crear'} Centro</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <textarea name="horarios" value={formData.horarios} onChange={handleChange} placeholder="Horarios" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Cancelar</button>
                        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminCentrosPage;
