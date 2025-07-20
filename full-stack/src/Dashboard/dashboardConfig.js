/**
 * Dashboard Configuration File
 * 
 * This file contains all the settings for your dashboard.
 * You can easily modify colors, add textboxes, and change the layout here.
 */

// Main dashboard configuration
export const dashboardConfig = {
  
  // Dashboard header settings
  header: {
    title: "Dashboard", // Change this to customize your dashboard title
  },
  
  // Color and styling theme
  theme: {
    gradientColors: {
      start: "#667eea",    // Starting color of gradient (blue)
      end: "#764ba2",      // Ending color of gradient (purple)  
      direction: "135deg"  // Gradient direction
    },
    textColor: "white",              // Text color
    fontFamily: "Arial, sans-serif"  // Font family
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
    
    // To add more textboxes, copy the above object and change the values:
    /*
    {
      id: "second-textbox",
      placeholder: "Another textbox...",
      position: { top: "50%", right: "25%" },
      size: "small",
      rows: 5,
      cols: 30,
      initialValue: "Hello World!"
    }
    */
  ]
};


/**
 * Helper function to create a new textbox easily
 * 
 * Example usage:
 * const myTextbox = createTextbox("my-textbox", {
 *   placeholder: "Type here...",
 *   position: { top: "30%", left: "50%" },
 *   size: "large"
 * });
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
