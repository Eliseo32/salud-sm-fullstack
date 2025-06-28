import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importar Navbar

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar /> {/* <-- Añadir Navbar aquí */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
export default App
