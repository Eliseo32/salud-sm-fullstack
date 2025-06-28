import axios from 'axios';

// Esta es la lógica clave:
// 1. Intenta leer la variable de entorno VITE_API_URL que configuramos en Vercel.
// 2. Si esa variable NO existe (porque estamos corriendo en local), usará 'http://localhost:3000' por defecto.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
    // Usamos la URL base y le añadimos el path de nuestra API
    baseURL: `${baseURL}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;
