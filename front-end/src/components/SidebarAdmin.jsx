
import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaChartBar,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/colis.jpeg";
import "../styles/Sidebar.css";

function SidebarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileActive, setMobileActive] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Utilisateurs", icon: <FaUsers />, path: "/admin/users" },
    { name: "Colis", icon: <FaBox />, path: "/admin/colis" },
    { name: "Colis en Transit", icon: <FaTruck />, path: "/admin/colis-transit" },
    { name: "Colis Livrés", icon: <FaCheckCircle />, path: "/admin/colis-livres" },
    { name: "Colis par Voyage", icon: <FaChartBar />, path: "/admin/statistiques" },
    { name: "Notifications", icon: <FaBell />, path: "/admin/notifications" },
    { name: "Profil", icon: <FaCog />, path: "/admin/settings" },
    { name: "Déconnexion", icon: <FaSignOutAlt />, path: "/" },
  ];

  const handleMenuClick = (item) => {
    if (item.name === "Déconnexion") {
      logout();
      navigate("/");
    }
    if (window.innerWidth <= 992) setMobileActive(false);
  };

  return (
    <>
      {/* Bouton toggle mobile */}
      <button className="mobile-toggle-btn" onClick={() => setMobileActive(!mobileActive)}>
        <FaBars />
      </button>

      {/* Overlay mobile */}
      {mobileActive && <div className="sidebar-overlay" onClick={() => setMobileActive(false)}></div>}

      <div className={`sidebar-new ${collapsed ? "collapsed" : ""} ${mobileActive ? "active" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          {!collapsed && <h2 className="sidebar-title">Admin</h2>}
          <button className="collapse-btn desktop" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <ul className="sidebar-menu-new">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={location.pathname === item.path ? "active" : ""}
              title={collapsed ? item.name : ""}
            >
              <Link to={item.path} onClick={() => handleMenuClick(item)}>
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && <span className="menu-text">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SidebarAdmin;