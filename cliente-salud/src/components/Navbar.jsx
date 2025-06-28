import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth(); // Ahora usamos 'user' en lugar de 'token'

    return (
        <nav className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold text-white">Salud SM</Link>
                <div>
                    {user ? (
                        <>
                            {user.rol === 'admin' && ( // <-- Condición para el rol de admin
                                <Link to="/admin" className="font-bold text-yellow-400 hover:text-yellow-300 px-3 py-2">Panel Admin</Link>
                            )}
                            <Link to="/mis-turnos" className="text-gray-300 hover:text-white px-3 py-2">Mis Turnos</Link>
                            <Link to="/solicitar-turno" className="text-gray-300 hover:text-white px-3 py-2">Solicitar Turno</Link>
                            <Link to="/mi-perfil" className="text-gray-300 hover:text-white px-3 py-2">Mi Perfil</Link>
                            <button onClick={logout} className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">Salir</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2">Login</Link>
                            <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2">Registro</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
