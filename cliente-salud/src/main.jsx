import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';

// Importar páginas
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // <-- Nuevo
import ProfilePage from './pages/ProfilePage.jsx';
import MisTurnosPage from './pages/MisTurnosPage.jsx'; // <-- Nuevo
import SolicitarTurnoPage from './pages/SolicitarTurnoPage.jsx'; // <-- Nuevo
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx'; // <-- Nuevo
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'; // <-- Nuevo
import AdminCentrosPage from './pages/admin/AdminCentrosPage.jsx'; // <-- Nuevo
import AdminProfesionalesPage from './pages/admin/AdminProfesionalesPage.jsx'; // <-- Nuevo
import AdminTurnosPage from './pages/admin/AdminTurnosPage.jsx'; // <-- Nuevo
import AdminDisponibilidadPage from './pages/admin/AdminDisponibilidadPage.jsx'; // <-- NUEVO


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'mi-perfil',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: 'mis-turnos', // <-- Nueva ruta
        element: <ProtectedRoute><MisTurnosPage /></ProtectedRoute>
      },
      {
        path: 'solicitar-turno', // <-- Nueva ruta
        element: <ProtectedRoute><SolicitarTurnoPage /></ProtectedRoute>
      },
      {
        path: 'admin', // <-- Nueva ruta de admin
        element: <AdminRoute><AdminDashboardPage /></AdminRoute>
      },
      { 
        path: 'admin/centros', // <-- Nueva ruta
        element: <AdminRoute><AdminCentrosPage /></AdminRoute>
      },
      {
        path: 'admin/profesionales', // <-- Nueva ruta
        element: <AdminRoute><AdminProfesionalesPage /></AdminRoute>
      },
      {
        path: 'admin/turnos', // <-- NUEVA RUTA
        element: <AdminRoute><AdminTurnosPage /></AdminRoute>
      },
      {
        path: 'admin/disponibilidad', // <-- NUEVA RUTA
        element: <AdminRoute><AdminDisponibilidadPage /></AdminRoute>
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
