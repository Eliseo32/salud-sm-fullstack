import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

function RegisterPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await apiClient.post('/auth/register', formData);
            setSuccess('¡Registro exitoso! Serás redirigido al login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Error en el registro. Verifique sus datos.');
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center mt-10">
            <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-white">Crear una Cuenta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="nombre" placeholder="Nombre" onChange={handleChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                        <input name="apellido" placeholder="Apellido" onChange={handleChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    </div>
                    <input name="dni" placeholder="DNI" onChange={handleChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                    <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" required />

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    {success && <p className="text-sm text-green-500 text-center">{success}</p>}

                    <button type="submit" className="w-full px-4 py-2 text-white bg-cyan-600 rounded-md hover:bg-cyan-700">
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
