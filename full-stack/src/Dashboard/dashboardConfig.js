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
      position: { top: "30%", left: "15%" },     // Adjusted to make room for file uploader
      size: "large",                           
      rows: 8,                                   // Number of rows (height)
      cols: 40,                                  // Number of columns (width)
      initialValue: "",                          // Starting text (empty by default)
    },
  ],

  //simple text elements
  textElements: [
    {
      id: "welcome-text",
      text: "Welcome to the TOS Dumbifier!\nThis is a simple tool to help you understand the Terms of Service of any website.",
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
      position: { top: "20%", left: "15%" },
      style: {
        fontSize: "1rem"
      }
    }
  ]
};
