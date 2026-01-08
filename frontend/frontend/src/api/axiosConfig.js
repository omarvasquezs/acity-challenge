import axios from 'axios';

const api = axios.create({
    // URL base de tu API .NET 9
    baseURL: 'http://localhost:5187',
});

// Interceptor para inyectar el token en cada cabecera
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar la invalidación de sesión (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si el SecurityStamp cambió en la BD, el token es inválido y recibimos 401
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;