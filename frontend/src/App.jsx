import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Importación necesaria
import Login from './pages/Login';
import Orders from './pages/Orders';
import Users from './pages/Users';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* Toaster global con configuración de estilo Atlantic City */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      <Routes>
        <Route element={<ProtectedRoute isPublic={true} />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute isPublic={false} />}>
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/usuarios" element={<Users />} />
        </Route>

        <Route path="/" element={<Navigate to="/pedidos" replace />} />
      </Routes>
    </Router>
  );
}

export default App;