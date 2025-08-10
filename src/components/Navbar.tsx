import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(user);
        setUserEmail(userData.email);
      } catch (e) {
        console.error("Error parsing user data", e);
        setIsAuthenticated(false); 
      }
    } else {
      setIsAuthenticated(false);
      setUserEmail("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserEmail("");
    navigate("/login");
  };

  const authItems = [
    { path: "/login", label: "Iniciar sesión" },
    { path: "/register", label: "Registrarse" }
  ];

  const protectedNavItems = [
    { path: "/", label: "Inicio" },
    { path: "/rutas", label: "Rutas" },
    { path: "/recorridos", label: "Recorridos" },
    { path: "/perfil", label: "Perfil" },
    { path: "/logros", label: "Logros" },
    { path: "/ranking", label: "Ranking" }
  ];

  return (
    <nav className="bg-green-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">EcoRuta</h1>
      
      <div className="flex items-center space-x-6">
        <ul className="flex space-x-6">
          {(isAuthenticated ? protectedNavItems : authItems).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`hover:underline ${
                  location.pathname === item.path ? "font-bold underline" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {isAuthenticated && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hola, {userEmail}</span>
            <button 
              onClick={handleLogout}
              className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
