
//dashboard configuration
export const dashboardConfig = {
  
  // Dashboard header settings
  header: {
    title: "Dashboard", // dashboard title
  },
  
  // Color and styling theme
  theme: {
    gradientColors: {
      start: "#667eea",    // Starting color of gradient (blue)
      end: "#764ba2",      // Ending color of gradient (purple)  
      direction: "135deg"  // Gradient direction
    },
    textColor: "white",              
    fontFamily: "Arial, sans-serif"  
  },
  
  // List of textboxes to display on the dashboard
  textboxes: [
    {
      id: "main-textbox",                        // Unique name for this textbox
      placeholder: "Enter your text here...",    // Placeholder text
      position: { top: "20%", left: "25%" },     // Where to place the textbox
      size: "medium",                            // Size: "small", "medium", or "large"
      rows: 8,                                   // Number of rows (height)
      cols: 40,                                  // Number of columns (width)
      initialValue: "",                          // Starting text (empty by default)
    },
    
  ]
};


/**
 * Helper function to create a new textbox easily
 */
export const createTextbox = (id, options = {}) => {
  return {
    id: id,
    placeholder: options.placeholder || "Enter text...",
    position: options.position || { top: "50%", left: "50%" },
    size: options.size || "medium",
    rows: options.rows || 6,
    cols: options.cols || 30,
    initialValue: options.initialValue || ""
  };
};
