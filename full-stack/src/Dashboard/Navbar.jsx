import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

/**
 * Left-side Navbar
 * - Collapsible
 * - Highlights active route
 * - Logout handled with useAuth()
 */
const Navbar = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // restore persisted state (default collapsed)
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("navbarExpanded");
    return saved ? saved === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("navbarExpanded", String(isExpanded));
    if (typeof onToggle === "function") onToggle(isExpanded);
  }, [isExpanded, onToggle]);

  const toggleNavbar = () => setIsExpanded((v) => !v);
  const onToggleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleNavbar();
    }
  };

  const navItems = useMemo(
    () => [
      { id: "dashboard", label: "Dashboard", icon: "/svg_icons/dashboardIcon.svg", to: "/dashboard" },
      { id: "dictionary", label: "Dictionary", icon: "/svg_icons/dictionaryIcon.svg", to: "/dictionary" },
      { id: "history", label: "History", icon: "/svg_icons/historyIcon.svg", to: "/history" },
      { id: "help", label: "Help", icon: "/svg_icons/helpIcon.svg", to: "/help" },
    ],
    []
  );

  const isActive = (to) => {
    // consider startsWith so nested pages highlight parent
    return location.pathname === to || location.pathname.startsWith(to);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <nav className={`navbar ${isExpanded ? "expanded" : "collapsed"}`} aria-label="Primary">
      {/* Toggle */}
      <button
        className="navbar-toggle"
        onClick={toggleNavbar}
        onKeyUp={onToggleKey}
        aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
        aria-expanded={isExpanded}
      >
        <img src="/svg_icons/menuIcon.svg" alt="" className="menu-icon" />
      </button>

      {/* Items */}
      <ul className="navbar-items">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <li key={item.id} className={`navbar-item ${active ? "active" : ""}`}>
              <Link
                to={item.to}
                className="navbar-link"
                aria-current={active ? "page" : undefined}
              >
                <img src={item.icon} alt="" className="navbar-icon" />
                <span className="navbar-label">{item.label}</span>
              </Link>
            </li>
          );
        })}

        {/* Logout */}
        <li className="navbar-item">
          <a href="#" className="navbar-link" onClick={handleLogout}>
            <img src="/svg_icons/exitIcon.svg" alt="" className="navbar-icon" />
            <span className="navbar-label">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
