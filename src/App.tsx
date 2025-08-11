import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rutas from "./pages/Rutas";
import Recorridos from "./pages/Recorridos";
import Perfil from "./pages/Perfil";
import Logros from "./pages/Logros";
import Ranking from "./pages/Ranking";
import ProtectedRoute from "./components/ProtectedRoute";
import RolesPage from "./pages/Roles";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rutas"
          element={
            <ProtectedRoute>
              <Rutas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recorridos"
          element={
            <ProtectedRoute>
              <Recorridos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logros"
          element={
            <ProtectedRoute>
              <Logros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ranking"
          element={
            <ProtectedRoute>
              <Ranking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <RolesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster/>
    </>
  );
}
