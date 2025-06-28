import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminTurnosPage() {
    const { token } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllTurnos = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await apiClient.get('/admin/turnos', config);
                setTurnos(response.data);
            } catch (error) {
                console.error("Error al obtener todos los turnos", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAllTurnos();
        }
    }, [token]);

    if (loading) return <p className="text-white text-center mt-8">Cargando todos los turnos...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Dashboard de Turnos del Sistema</h1>

            <div className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3">Fecha y Hora</th>
                            <th className="p-3">Paciente</th>
                            <th className="p-3">DNI Paciente</th>
                            <th className="p-3">Profesional</th>
                            <th className="p-3">Especialidad</th>
                            <th className="p-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map(turno => (
                            <tr key={turno.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="p-3">{new Date(turno.fecha_hora).toLocaleString('es-AR')}</td>
                                <td className="p-3">{turno.Paciente?.nombre} {turno.Paciente?.apellido}</td>
                                <td className="p-3">{turno.Paciente?.dni}</td>
                                <td className="p-3">{turno.Profesional?.nombre} {turno.Profesional?.apellido}</td>
                                <td className="p-3">{turno.Profesional?.especialidad}</td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 text-sm rounded-full ${
                                        turno.estado === 'Pendiente' ? 'bg-yellow-500 text-black' :
                                        turno.estado === 'Cancelado' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                    }`}>
                                        {turno.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTurnosPage;
