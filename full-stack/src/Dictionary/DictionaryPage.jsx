import React, { useState } from 'react';
import './DictionaryPage.css';

const API_URL = 'https://api.api-ninjas.com/v1/dictionary?word=';
const API_KEY = ''; // API Ninjas key

const DictionaryPage = () => {
  const [word, setWord] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      <div className="dictionary-page-container">
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
  );
};

export default DictionaryPage;
