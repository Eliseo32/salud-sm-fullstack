import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import { jwtDecode } from 'jwt-decode'; // <-- Importar

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        // Si hay un token al cargar la página, decodificamos para obtener el usuario
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode(token); // Decodificamos el nuevo token
        setUser(decodedUser); // Guardamos el usuario en el estado
        setToken(token);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = { token, user, login, logout }; // Ahora también exportamos 'user'

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
