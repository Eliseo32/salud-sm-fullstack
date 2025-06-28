import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api/v1', // La URL base de nuestra API
    headers: {
        'Content-Type': 'application/json'
    }
});

export default apiClient;
