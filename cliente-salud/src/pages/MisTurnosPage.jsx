import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

function MisTurnosPage() {
    const { token } = useAuth();
    const [turnos, setTurnos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTurnos = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await apiClient.get('/turnos', config);
            setTurnos(response.data);
        } catch (error) {
            console.error("Error al obtener los turnos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchTurnos();
        }
    }, [token]);

    const handleCancelar = async (turnoId) => {
        if (window.confirm('¿Estás seguro de que deseas cancelar este turno?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await apiClient.put(`/turnos/${turnoId}/cancelar`, {}, config);
                // Actualizamos la lista de turnos para reflejar el cambio
                fetchTurnos();
            } catch (error) {
                console.error("Error al cancelar el turno", error);
                alert("No se pudo cancelar el turno.");
            }
        }
    };

    if (loading) return <p className="text-white text-center mt-8">Cargando tus turnos...</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Mis Turnos</h1>
            {turnos.length > 0 ? (
                <div className="max-w-4xl mx-auto space-y-4">
                    {turnos.map(turno => (
                        <div key={turno.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xl text-cyan-400">
                                    Dr. {turno.Profesional.nombre} {turno.Profesional.apellido}
                                </p>
                                <p className="text-gray-300">{turno.Profesional.especialidad}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {new Date(turno.fecha_hora).toLocaleString('es-AR')}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 text-sm rounded-full ${
                                    turno.estado === 'Pendiente' ? 'bg-yellow-500 text-black' :
                                    turno.estado === 'Cancelado' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                }`}>
                                    {turno.estado}
                                </span>
                                {turno.estado === 'Pendiente' && (
                                    <button 
                                        onClick={() => handleCancelar(turno.id)}
                                        className="ml-4 mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white text-center">No tienes turnos pendientes.</p>
            )}
        </div>
    );
}

export default MisTurnosPage;
