import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

function SolicitarTurnoPage() {
    const { token } = useAuth();
    const navigate = useNavigate();
    
    const [profesionales, setProfesionales] = useState([]);
    const [profesionalSeleccionado, setProfesionalSeleccionado] = useState('');
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState('');
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfesionales = async () => {
            const response = await apiClient.get('/profesionales');
            setProfesionales(response.data);
        };
        fetchProfesionales();
    }, []);

    useEffect(() => {
        if (profesionalSeleccionado && fechaSeleccionada) {
            setLoadingHorarios(true);
            setHorariosDisponibles([]);
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            apiClient.get(`/disponibilidad/profesional/${profesionalSeleccionado}/horarios?fecha=${fechaSeleccionada}`, config)
                .then(response => setHorariosDisponibles(response.data))
                .catch(err => console.error("Error al buscar horarios", err))
                .finally(() => setLoadingHorarios(false));
        }
    }, [profesionalSeleccionado, fechaSeleccionada, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!horarioSeleccionado) {
            setError('Por favor, seleccione un horario.');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const turnoData = { profesionalId: profesionalSeleccionado, fecha_hora: horarioSeleccionado };
            await apiClient.post('/turnos', turnoData, config);
            alert('Turno solicitado con éxito');
            navigate('/mis-turnos');
        } catch (err) {
            setError('No se pudo solicitar el turno.');
        }
    };

    return (
        <div className="flex items-center justify-center mt-10">
            <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-white">Solicitar un Turno</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">1. Seleccione Profesional</label>
                        <select onChange={(e) => setProfesionalSeleccionado(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white">
                            <option value="">-- Profesionales --</option>
                            {profesionales.map(p => <option key={p.id} value={p.id}>Dr. {p.nombre} {p.apellido}</option>)}
                        </select>
                    </div>

                    {profesionalSeleccionado && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">2. Seleccione Fecha</label>
                            <input type="date" onChange={(e) => setFechaSeleccionada(e.target.value)} required className="w-full p-2 rounded bg-gray-700 text-white" />
                        </div>
                    )}

                    {loadingHorarios && <p className="text-cyan-400 text-center">Buscando horarios...</p>}
                    {horariosDisponibles.length > 0 && !loadingHorarios && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">3. Seleccione Horario</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {horariosDisponibles.map(hora => (
                                    <button type="button" key={hora} onClick={() => setHorarioSeleccionado(hora)} className={`p-2 rounded text-center ${horarioSeleccionado === hora ? 'bg-cyan-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}>
                                        {new Date(hora).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {!loadingHorarios && fechaSeleccionada && horariosDisponibles.length === 0 && (
                        <p className="text-yellow-500 text-center">No hay horarios disponibles para el día seleccionado.</p>
                    )}

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500" disabled={!horarioSeleccionado}>
                        Confirmar Turno
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SolicitarTurnoPage;
