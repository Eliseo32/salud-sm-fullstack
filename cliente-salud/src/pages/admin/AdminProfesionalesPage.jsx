import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminProfesionalesPage() {
    const { token } = useAuth();
    const [profesionales, setProfesionales] = useState([]);
    const [centros, setCentros] = useState([]); // Necesitamos la lista de centros para el formulario
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentProfesional, setCurrentProfesional] = useState(null);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profesionalesRes, centrosRes] = await Promise.all([
                apiClient.get('/profesionales'),
                apiClient.get('/centros')
            ]);
            setProfesionales(profesionalesRes.data);
            setCentros(centrosRes.data);
        } catch (error) {
            console.error("Error al obtener los datos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) {
            try {
                await apiClient.delete(`/profesionales/${id}`, config);
                fetchData();
            } catch (error) {
                alert('No se pudo eliminar el profesional.');
            }
        }
    };

    const handleSave = async (profesionalData) => {
        try {
            if (currentProfesional) {
                await apiClient.put(`/profesionales/${currentProfesional.id}`, profesionalData, config);
            } else {
                await apiClient.post('/profesionales', profesionalData, config);
            }
            fetchData();
            setShowModal(false);
            setCurrentProfesional(null);
        } catch (error) {
            alert('No se pudo guardar el profesional.');
        }
    };

    const openModalToCreate = () => {
        setCurrentProfesional(null);
        setShowModal(true);
    };

    const openModalToEdit = (profesional) => {
        setCurrentProfesional(profesional);
        setShowModal(true);
    };

    if (loading) return <p className="text-white text-center mt-8">Cargando...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Gestionar Profesionales</h1>
            <div className="flex justify-end mb-4">
                <button onClick={openModalToCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    Añadir Nuevo Profesional
                </button>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Especialidad</th>
                            <th className="p-3">Matrícula</th>
                            <th className="p-3">Centro de Salud</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profesionales.map(profesional => (
                            <tr key={profesional.id} className="border-b border-gray-700">
                                <td className="p-3">{profesional.nombre} {profesional.apellido}</td>
                                <td className="p-3">{profesional.especialidad}</td>
                                <td className="p-3">{profesional.matricula}</td>
                                <td className="p-3">{profesional.CentroDeSalud?.nombre || 'No asignado'}</td>
                                <td className="p-3">
                                    <button onClick={() => openModalToEdit(profesional)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2">Editar</button>
                                    <button onClick={() => handleDelete(profesional.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && <ProfesionalFormModal initialData={currentProfesional} centros={centros} onSave={handleSave} onClose={() => setShowModal(false)} />}
        </div>
    );
}

// Componente del Formulario en un Modal para Profesionales
function ProfesionalFormModal({ initialData, centros, onSave, onClose }) {
    const [formData, setFormData] = useState(initialData || {
        nombre: '', apellido: '', especialidad: '', matricula: '', centroId: ''
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
                <h2 className="text-2xl text-white mb-4">{initialData ? 'Editar' : 'Crear'} Profesional</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Especialidad" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <input name="matricula" value={formData.matricula} onChange={handleChange} placeholder="Matrícula" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <select name="centroId" value={formData.centroId} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="">Asignar a un Centro de Salud</option>
                        {centros.map(centro => (
                            <option key={centro.id} value={centro.id}>{centro.nombre}</option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Cancelar</button>
                        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminProfesionalesPage;
