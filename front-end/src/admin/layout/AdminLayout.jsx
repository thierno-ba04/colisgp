import { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import { FaMoon, FaSun } from "react-icons/fa";
import "../../styles/AdminLayout.css";

function AdminLayout({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true" || false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      
      {/* Navbar */}
      <nav className="navbar-admin">
        <div className="navbar-left">
        </div>
        <div className="navbar-right">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Mode clair" : "Mode sombre"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <SidebarAdmin />

      {/* Contenu principal */}
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;