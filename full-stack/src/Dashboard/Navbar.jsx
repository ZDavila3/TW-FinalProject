import React, { useState } from 'react';
import './Navbar.css';

/**
 * Navbar Component - Left-side navigation bar
 * 
 * This component renders a collapsible left-side navbar with navigation items
 */
const Navbar = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      icon: '/svg_icons/dashboard_25dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
      label: 'Dashboard',
      active: true
    },
    {
      id: 'help',
      icon: '/svg_icons/help_25dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
      label: 'Help'
    },
    {
      id: 'logout',
      icon: '/svg_icons/exit_to_app_25dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg',
      label: 'Logout'
    }
  ];

  return (
    <nav className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle button */}
      <button 
        className="navbar-toggle" 
        onClick={toggleNavbar}
        aria-label="Toggle navigation"
      >
        <img 
          src="/svg_icons/menu_25dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" 
          alt="Menu"
          className="menu-icon"
        />
      </button>

      {/* Navigation items */}
      <ul className="navbar-items">
        {navItems.map((item) => (
          <li key={item.id} className={`navbar-item ${item.active ? 'active' : ''}`}>
            <a href="#" className="navbar-link" onClick={(e) => e.preventDefault()}>
              <img 
                src={item.icon} 
                alt={item.label}
                className="navbar-icon"
              />
              <span className="navbar-label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
