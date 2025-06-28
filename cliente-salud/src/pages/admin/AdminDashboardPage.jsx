import { Link } from 'react-router-dom';

function AdminDashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">Panel de Administración</h1>
            <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
                <Link to="/admin/turnos" className="bg-purple-600 text-white text-center p-4 rounded-lg hover:bg-purple-700">
                    Ver Todos los Turnos
                </Link>
                <Link to="/admin/centros" className="bg-cyan-600 text-white text-center p-4 rounded-lg hover:bg-cyan-700">
                    Gestionar Centros de Salud
                </Link>
                <Link to="/admin/profesionales" className="bg-cyan-600 text-white text-center p-4 rounded-lg hover:bg-cyan-700">
                    Gestionar Profesionales
                </Link>
                {/* --- NUEVO ENLACE --- */}
                <Link to="/admin/disponibilidad" className="bg-orange-600 text-white text-center p-4 rounded-lg hover:bg-orange-700">
                    Gestionar Horarios
                </Link>
            </div>
        </div>
    );
}
export default AdminDashboardPage;