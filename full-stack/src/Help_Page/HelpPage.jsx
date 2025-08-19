import React from 'react';
import './HelpPage.css';

const HelpPage = () => (
  <div className="help-page-bg">
    <div className="help-page-container">
      <h1>How to Use the ToS Dumbifier Website</h1>
      <ol>
        <li>
          <strong>Sign Up / Log In:</strong> Create an account or log in to access all features.
        </li>
        <li>
          <strong>Upload or Paste Text:</strong> On your dashboard, you can either upload a document (like Terms of Service, Privacy Policy, or EULA) or paste text directly into the textbox.
        </li>
        <li>
          <strong>Process Document:</strong> Click the process button. The AI will analyze and simplify the legal jargon into plain English.
        </li>
        <li>
          <strong>Review Results:</strong> The results will appear in a scrollable box. You can read, copy, or save the simplified explanation.
        </li>
        <li>
          <strong>History:</strong> Your processed documents are saved to your account for future reference.
        </li>
        <li>
          <strong>Need Help?</strong> Click the Help button in the Navbar anytime to return to this page.
        </li>
      </ol>
      <h2>Tips</h2>
      <ul>
        <li>Use the dashboard for all document processing features.</li>
        <li>Results are private and only visible to you.</li>
        <li>If you encounter issues, please create an issue ticket on our Github on https://github.com/ZDavila3/TW-FinalProject.</li>
      </ul>
      <p className="help-footer">Disclaimer: This project is for educational purposes only and is not intended for commercial use. Any action by the user is used in descretion and at their own risk.</p>
    </div>
  </div>
);

export default HelpPage;
