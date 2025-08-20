import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './DictionaryPage.css';

const API_URL = 'https://api.api-ninjas.com/v1/dictionary?word=';
const API_KEY = 'VAlLcSG5dIG3YYUETn9yRA==bAuoY2TrOn34HkCL'; // API Ninjas key

const DictionaryPage = () => {
  // Safe auth context usage with fallback
  let authContext;
  let isAuthenticated = false;
  let token = null;
  
  try {
    authContext = useAuth();
    isAuthenticated = authContext?.isAuthenticated || false;
    token = authContext?.token || null;
  } catch (error) {
    console.warn('Auth context not available:', error.message);
  }
  
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedWords, setSavedWords] = useState([]);

  // Fetch saved words from backend on mount
  useEffect(() => {
    const fetchSavedWords = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await fetch('/api/saved-words', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch saved words');
        const data = await res.json();
        // data is array of { word }
        setSavedWords(data.map(item => item.word));
      } catch (err) {
        console.error('Failed to fetch saved words:', err);
      }
    };
    fetchSavedWords();
  }, [isAuthenticated, token]);
  // Save current word to backend and sidebar
  const handleSaveWord = async () => {
    const trimmed = word.trim();
    if (!trimmed) return;
    if (savedWords.includes(trimmed)) return;
    if (!isAuthenticated || !token) {
      alert('Please log in to save words');
      return;
    }
    try {
      const res = await fetch('/api/saved-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ word: trimmed }),
      });
      if (!res.ok) throw new Error('Failed to save word');
      setSavedWords([trimmed, ...savedWords]);
    } catch (err) {
      console.error('Failed to save word:', err);
      alert('Failed to save word. Please try again.');
    }
  };

  // Click on sidebar word to search it
  const handleSidebarClick = (w) => {
    setWord(w);
    setResult(null);
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      // Encode word for API (handles spaces and special characters)
      const query = encodeURIComponent(word.trim());
      const response = await fetch(`${API_URL}${query}`, {
        headers: { 'X-Api-Key': API_KEY }
      });
      if (!response.ok) throw new Error('No definition found.');
      const data = await response.json();
      // If API returns empty or no definition
      if (!data.definition) {
        setError('No definition found for this word.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format numbered definitions
  function formatDefinition(defText) {
    if (!defText) return null;
    // Split on numbers followed by a dot and space, but keep the number with the definition
    const parts = defText.split(/(?=\d\.\s)/);
    return parts.map((part, idx) => (
      <p key={idx} style={{ marginBottom: '10px' }}>{part.trim()}</p>
    ));
  }

  return (
    <div className="dictionary-page-bg">
      <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '900px', margin: '40px auto' }}>
        {/* Sidebar */}
        <div className="dictionary-sidebar" style={{ minWidth: '180px', background: 'rgba(255,255,255,0.10)', borderRadius: '16px', padding: '24px 12px', marginRight: '24px', color: '#fff', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#a5b4fc', fontSize: '1.1rem' }}>Saved Words</h3>
          {savedWords.length === 0 ? (
            <p style={{ color: '#e0e0e0' }}>No saved words.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {savedWords.map((w, idx) => (
                <li key={idx} style={{ marginBottom: '10px', cursor: 'pointer', color: '#fff', borderBottom: '1px solid #a5b4fc', paddingBottom: '4px' }} onClick={() => handleSidebarClick(w)}>
                  {w}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Main Dictionary UI */}
        <div className="dictionary-page-container" style={{ flex: 1 }}>
          <h1>Legal Dictionary Lookup</h1>
          <form onSubmit={handleSearch} className="dictionary-form">
            <input
              type="text"
              value={word}
              onChange={e => setWord(e.target.value)}
              placeholder="Enter a legal word..."
              className="dictionary-input"
              required
            />
            <button type="submit" className="dictionary-search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" className="dictionary-search-btn" style={{ background: '#764ba2', marginLeft: '4px' }} onClick={handleSaveWord} disabled={!word.trim()}>
              Save
            </button>
          </form>
          {error && <div className="dictionary-error">{error}</div>}
          {result && (
            <div className="dictionary-result">
              <h2>{result.word}</h2>
              {result.definition && (
                <div className="dictionary-section">
                  <strong>Definition:</strong>
                  {formatDefinition(result.definition)}
                </div>
              )}
              {result.example && (
                <div className="dictionary-section">
                  <strong>Example:</strong>
                  <p>{result.example}</p>
                </div>
              )}
              {result.synonyms && result.synonyms.length > 0 && (
                <div className="dictionary-section">
                  <strong>Synonyms:</strong>
                  <ul>
                    {result.synonyms.map((syn, idx) => (
                      <li key={idx}>{syn}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.antonyms && result.antonyms.length > 0 && (
                <div className="dictionary-section">
                  <strong>Antonyms:</strong>
                  <ul>
                    {result.antonyms.map((ant, idx) => (
                      <li key={idx}>{ant}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {(!result && !loading && !error && word) && (
            <div className="dictionary-result">
              <p>No definition found for "{word}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DictionaryPage;
