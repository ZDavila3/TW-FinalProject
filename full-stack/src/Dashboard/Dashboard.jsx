import React, { useState } from 'react';
import './Dashboard.css';
import { dashboardConfig } from './dashboardConfig.js';
import Navbar from './Navbar.jsx';

/**
 * renders a dashboard with a title and textboxes
 * based on dashboardConfig.js
 */
const Dashboard = () => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  
  // Function to get the right CSS class for textbox size
  const getTextboxSizeClass = (size) => {
    // Map size names to CSS class names
    if (size === 'small') return 'textbox-small';
    if (size === 'medium') return 'textbox-medium';
    if (size === 'large') return 'textbox-large';
    
    // Default to medium if size not recognized
    return 'textbox-medium';
  };

  // Function to convert position object to CSS styles
  const getTextboxPosition = (position) => {
    return {
      position: 'absolute',
      top: position.top || '50%',
      left: position.left || '50%',
      right: position.right,
      bottom: position.bottom,
      transform: position.transform || 'none'
    };
  };

  return (
    <div className={`dashboard ${isNavbarExpanded ? 'navbar-expanded' : ''}`}>
      <Navbar onToggle={setIsNavbarExpanded} />
      
      {/* Dashboard Title */}
      <h1 className="dashboard-title">
        {dashboardConfig.header.title}
      </h1>
      
      {/* Render all textboxes from config */}
      {dashboardConfig.textboxes.map((textbox) => (
        <textarea
          key={textbox.id}
          id={textbox.id}
          className={`textbox-base ${getTextboxSizeClass(textbox.size)}`}
          style={getTextboxPosition(textbox.position)}
          placeholder={textbox.placeholder}
          rows={textbox.rows}
          cols={textbox.cols}
          defaultValue={textbox.initialValue}
        />
      ))}
      
  
      {/* Renders simple text to the dashboard */}
      {dashboardConfig.textElements?.map((textElement) => (
        <div
          key={textElement.id}
          id={textElement.id}
          className="text-element"
          style={{
            position: 'absolute',
            top: textElement.position.top,
            left: textElement.position.left,
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            zIndex: 10,
            ...textElement.style
          }}
        >
          {textElement.text}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;