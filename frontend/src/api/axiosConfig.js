import axios from 'axios';

const api = axios.create({
  // Agregamos /api al final de la URL
  baseURL: 'http://localhost:5187/api', 
});

// Interceptor para adjuntar el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar la invalidación de sesión por SecurityStamp
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde 401, el token o el stamp ya no son válidos
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;