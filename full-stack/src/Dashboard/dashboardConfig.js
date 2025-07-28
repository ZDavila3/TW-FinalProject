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
      direction: "135deg"  // Gradient coloring direction
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
      size: "medium",                           
      rows: 8,                                   // Number of rows (height)
      cols: 40,                                  // Number of columns (width)
      initialValue: "",                          // Starting text (empty by default)
    },
  ],

  //simple text elements
  textElements: [
    {
      id: "welcome-text",
      text: "Welcome to the Translation Dashboard",
      position: { top: "10%", left: "50%" },
      style: {
        fontSize: "1.5rem",
        textAlign: "center",
        transform: "translateX(-50%)"
      }
    },
    {
      id: "instruction-text", 
      text: "Please copy and paste the text you want to translate here. Or upload your file to translate.",
      position: { top: "15%", left: "25%" },
      style: {
        fontSize: "1rem"
      }
    }
  ]
};


/**
 * create a new textbox
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
