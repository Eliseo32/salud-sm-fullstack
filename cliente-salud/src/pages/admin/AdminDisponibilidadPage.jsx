import { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function AdminDisponibilidadPage() {
    const [profesionales, setProfesionales] = useState([]);
    const [selectedProfesional, setSelectedProfesional] = useState(null);

    useEffect(() => {
        const fetchProfesionales = async () => {
            const response = await apiClient.get('/profesionales');
            setProfesionales(response.data);
        };
        fetchProfesionales();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Gestionar Disponibilidad Horaria</h1>
            <div className="max-w-md mx-auto mb-8">
                <label className="block mb-2 text-sm font-medium text-gray-300">Seleccione un Profesional</label>
                <select onChange={(e) => setSelectedProfesional(profesionales.find(p => p.id === parseInt(e.target.value)))} className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600">
                    <option value="">-- Elija un profesional --</option>
                    {profesionales.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido} ({p.especialidad})</option>)}
                </select>
            </div>
            {selectedProfesional && <HorariosManager profesional={selectedProfesional} />}
        </div>
    );
}

function HorariosManager({ profesional }) {
    const { token } = useAuth();
    const [horarios, setHorarios] = useState([]);
    const [dia, setDia] = useState('1');
    const [horaInicio, setHoraInicio] = useState('09:00');
    const [horaFin, setHoraFin] = useState('17:00');
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const fetchHorarios = async () => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await apiClient.get(`/disponibilidad/profesional/${profesional.id}`, config);
        setHorarios(response.data);
    };

    useEffect(() => { fetchHorarios(); }, [profesional]);

    const handleAddHorario = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const nuevoHorario = { dia_semana: parseInt(dia), hora_inicio: horaInicio, hora_fin: horaFin };
        await apiClient.post(`/disponibilidad/profesional/${profesional.id}`, nuevoHorario, config);
        fetchHorarios();
    };

    const handleDelete = async (id) => {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await apiClient.delete(`/disponibilidad/${id}`, config);
        fetchHorarios();
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl text-white mb-4">Horarios de {profesional.nombre} {profesional.apellido}</h2>
            <form onSubmit={handleAddHorario} className="flex flex-col md:flex-row gap-4 mb-6 items-end">
                <div className="flex-1"><label className="text-gray-300 block mb-1">Día</label><select value={dia} onChange={(e) => setDia(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white">{diasSemana.map((nombreDia, index) => index > 0 && <option key={index} value={index}>{nombreDia}</option>)}</select></div>
                <div className="flex-1"><label className="text-gray-300 block mb-1">Hora Inicio</label><input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" /></div>
                <div className="flex-1"><label className="text-gray-300 block mb-1">Hora Fin</label><input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" /></div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Añadir</button>
            </form>
            <ul className="space-y-2">{horarios.map(h => <li key={h.id} className="bg-gray-700 p-3 rounded flex justify-between items-center"><span className="text-white">{diasSemana[h.dia_semana]}: {h.hora_inicio} - {h.hora_fin}</span><button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-400">Eliminar</button></li>)}</ul>
        </div>
    );
}

export default AdminDisponibilidadPage;
