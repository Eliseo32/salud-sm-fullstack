import { useState, useEffect } from 'react';
import apiClient from '../services/api'; // Importamos nuestro cliente de API

function HomePage() {
    const [centros, setCentros] = useState([]); // Un estado para guardar la lista de centros
    const [loading, setLoading] = useState(true); // Un estado para saber si está cargando
    const [error, setError] = useState(null); // Un estado para guardar errores

    // useEffect se ejecuta cuando el componente se monta por primera vez
    useEffect(() => {
        const fetchCentros = async () => {
            try {
                // Hacemos la petición GET a la ruta de centros
                const response = await apiClient.get('/centros');
                setCentros(response.data); // Guardamos los datos en el estado
            } catch (err) {
                setError(err.message); // Si hay un error, lo guardamos
            } finally {
                setLoading(false); // Dejamos de cargar, haya éxito o error
            }
        };

        fetchCentros();
    }, []); // El array vacío asegura que solo se ejecute una vez

    if (loading) return <p className="text-white text-center mt-8">Cargando centros de salud...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">Centros de Salud en Santa María</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {centros.map(centro => (
                    <div key={centro.id} className="bg-gray-800 rounded-lg p-6 shadow-lg text-white">
                        <h2 className="text-2xl font-semibold text-cyan-400 mb-2">{centro.nombre}</h2>
                        <p className="text-gray-300">{centro.direccion}</p>
                        <p className="text-gray-400 mt-2">{centro.telefono}</p>
                        <p className="text-gray-400">{centro.horarios}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;
