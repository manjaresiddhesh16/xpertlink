import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Experts() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // read ?query=... from URL (doubt text)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query') || '';
    setSearch(q);
  }, [location.search]);

  const fetchExperts = async () => {
  try {
    // 🔥 Hardcode backend URL for now so there is no confusion
    const API_BASE = 'http://localhost:8080';
    const url = `${API_BASE}/experts`;
    const token = localStorage.getItem('token');

    console.log('Experts fetch URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token,          // no "Bearer " because of your middleware
        'Content-Type': 'application/json',
      },
    });

    console.log('Experts status:', response.status);
    const text = await response.text();
    console.log('Experts text response:', text);

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('Response is not JSON, it is HTML or something else');
      handleError('Backend did not return JSON for /experts');
      setExperts([]);
      return;
    }

    console.log('Experts JSON result:', result);

    let list = [];
    if (Array.isArray(result)) {
      list = result;
    } else if (Array.isArray(result.experts)) {
      list = result.experts;
    } else if (Array.isArray(result.data)) {
      list = result.data;
    }

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

  // 🔍 filter by name / skills / bio using search text
  const filteredExperts = experts.filter((exp) => {
    // 🔍 filter by name / skills / bio
let filteredExperts = experts;
if (search) {
  const text = search.toLowerCase();
  filteredExperts = experts.filter((exp) => {
    const name = exp.name?.toLowerCase() || '';
    const skills = Array.isArray(exp.skills)
      ? exp.skills.join(' ').toLowerCase()
      : '';
    const bio = exp.bio?.toLowerCase() || '';

    return (
      name.includes(text) ||
      skills.includes(text) ||
      bio.includes(text)
    );
  });

  // if nothing matches, show all so page doesn't look empty
  if (filteredExperts.length === 0) {
    filteredExperts = experts;
  }
}

console.log('All experts:', experts);
console.log('Search:', search, 'Filtered experts:', filteredExperts);

  });

  const handleRequestSession = async (expert) => {
    const doubtText = search || 'General doubt';
    const topic =
      (Array.isArray(expert.skills) && expert.skills[0]) ||
      'Live help';

    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const url = `${API_BASE}/sessions`;
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': token, // again: no Bearer
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expertId: expert._id,
          topic,
          doubtText
        })
      });

      const result = await response.json();
      console.log('Session request result:', result);

      if (response.ok && result.success) {
        handleSuccess('Session request sent to expert');
      } else {
        handleError(result.message || 'Failed to create session');
      }
    } catch (err) {
      console.error('Session request error:', err);
      handleError(err.message || 'Failed to create session');
    }
  };

  return (
    <div className="xpert-container">
      <h1 className="xpert-section-title">
        {search ? `Experts for: "${search}"` : 'Available Experts'}
      </h1>

      {/* Search bar */}
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
              {exp.skills && exp.skills.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '4px' }}>
                  Skills: {exp.skills.join(', ')}
                </div>
              )}
              <div className="xpert-stars">
                ⭐ <span className="xpert-rating">
                  {exp.rating != null ? exp.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              <div className="xpert-price">
                ₹{exp.pricePerSession || 400} / session
              </div>
              <button
                className="xpert-connect-btn"
                onClick={() => handleRequestSession(exp)}
              >
                Request session
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
