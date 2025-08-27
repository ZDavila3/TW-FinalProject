import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './Dashboard/Dashboard';
import AuthForm from './components/AuthForm';
import HelpPage from './Help_Page/HelpPage';
import Navbar from './Dashboard/Navbar';
import DictionaryPage from './Dictionary/DictionaryPage';
import HistoryPage from './pages/HistoryPage.jsx';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('App Error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthForm />} />
      <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
      <Route path="/help" element={<><Navbar /><HelpPage /></>} />
      <Route path="/dictionary" element={<><Navbar /><DictionaryPage /></>} />
      <Route path="/history" element={<><Navbar /><HistoryPage /></>} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
