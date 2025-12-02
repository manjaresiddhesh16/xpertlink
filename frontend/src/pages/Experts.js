import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Experts() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // read ?query=... from URL (the doubt text)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query') || '';
    setSearch(q);
  }, [location.search]);

  const fetchExperts = async () => {
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const url = `${API_BASE}/experts`;
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Experts status:', response.status);

      if (!response.ok) {
        const txt = await response.text();
        console.error('Experts error body:', txt);
        handleError('Failed to load experts');
        setExperts([]);
        return;
      }

      const result = await response.json();
      console.log('Experts raw result:', result);

      const list = Array.isArray(result) ? result : [];
      setExperts(list);
    } catch (err) {
      console.error('Experts fetch error:', err);
      handleError(err.message || 'Failed to load experts');
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  // 🔍 filter by name or skill using search/doubt text
  const filteredExperts = experts.filter((exp) => {
    const text = search.toLowerCase();
    const name = exp.name?.toLowerCase() || '';
    const skill = exp.skill?.toLowerCase() || '';
    return name.includes(text) || skill.includes(text);
  });

  return (
    <div className="xpert-container">
      <h1 className="xpert-section-title">
        {search
          ? `Experts for: "${search}"`
          : 'Available Experts'}
      </h1>

      {/* Search bar (user can adjust doubt/topic here too) */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Refine by topic, tech or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '10px 12px',
            borderRadius: '999px',
            border: '1px solid #ffb199',
            width: '100%',
            maxWidth: '420px'
          }}
        />
      </div>

      {loading ? (
        <p>Loading experts...</p>
      ) : filteredExperts.length === 0 ? (
        <p>No experts found for this doubt.</p>
      ) : (
        <div className="xpert-grid">
          {filteredExperts.map((exp) => (
            <div key={exp._id || exp.name} className="xpert-card xpert-expert-card">
              <div className="xpert-expert-photo">
                {exp.name?.charAt(0) || 'X'}
              </div>
              <div className="xpert-expert-name">{exp.name}</div>
              <div className="xpert-stars">
                ⭐ <span className="xpert-rating">
                  {exp.rating != null ? exp.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              {exp.skill && (
                <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                  Skill: {exp.skill}
                </div>
              )}
              <div className="xpert-price">₹{exp.price} / session</div>
              <button
                className="xpert-connect-btn"
                onClick={() => handleSuccess(`Connecting to ${exp.name} soon...`)}
              >
                Connect Now
              </button>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Experts;
