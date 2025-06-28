import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
    const { token } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await apiClient.get('/pacientes/mi-perfil', config);
                setPerfil(response.data);
            } catch (error) {
                console.error("Error al obtener el perfil", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPerfil();
        }
    }, [token]);

    if (loading) return <p className="text-white text-center mt-8">Cargando perfil...</p>;

    return (
        <div className="container mx-auto p-4 mt-10">
            <div className="w-full max-w-lg mx-auto p-8 bg-gray-800 rounded-lg shadow-md text-white">
                <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Mi Perfil</h1>
                {perfil ? (
                    <div className="space-y-4">
                        <p><span className="font-semibold text-gray-400">Nombre:</span> {perfil.nombre} {perfil.apellido}</p>
                        <p><span className="font-semibold text-gray-400">DNI:</span> {perfil.dni}</p>
                        <p><span className="font-semibold text-gray-400">Email:</span> {perfil.email}</p>
                        <p><span className="font-semibold text-gray-400">Teléfono:</span> {perfil.telefono || 'No especificado'}</p>
                    </div>
                ) : (
                    <p>No se pudo cargar la información del perfil.</p>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
