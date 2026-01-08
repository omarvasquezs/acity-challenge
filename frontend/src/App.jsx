import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Users from './pages/Users';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS: Protegidas para que no vuelvas al login si ya estás adentro */}
        <Route element={<ProtectedRoute isPublic={true} />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* RUTAS PRIVADAS: Solo accesibles con Token */}
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