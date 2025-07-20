import React from 'react';
import './Dashboard.css';
import { dashboardConfig } from './dashboardConfig.js';

/**
 * Dashboard Component - Main dashboard page with textboxes
 * 
 * This component renders a dashboard with a title and textboxes
 * based on the configuration in dashboardConfig.js
 */
const Dashboard = () => {
  
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
    <div className="dashboard">
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
    </div>
  );
};

export default Dashboard;