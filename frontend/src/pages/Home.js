import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [experts, setExperts] = useState([]);
  const [doubt, setDoubt] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  setLoggedInUser(localStorage.getItem('loggedInUser') || '');
  setRole(localStorage.getItem('role') || '');
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User logged out');
    setTimeout(() => navigate('/login'), 1000);
  };

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

      if (!response.ok) {
        console.error('Experts error status:', response.status);
        return;
      }

      const result = await response.json();
      console.log('Experts API result on Home:', result);

      const list = Array.isArray(result) ? result : [];
      setExperts(list);
    } catch (err) {
      console.error('Experts fetch error:', err);
      handleError(err.message || 'Failed to load experts');
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  const recommendedExperts = experts.slice(0, 4);

  const recentSessions = [
    { title: 'React Hooks Debugging', name: 'Sarah J.', time: '2h ago' },
    { title: 'Algorithm Optimization', name: 'Mike C.', time: '1 day ago' },
    { title: 'Python Flask API', name: 'Emma R.', time: '3 days ago' },
    { title: 'Video Editing Workflow', name: 'David K.', time: '5 days ago' },
  ];

  // 🔍 when user types a doubt & submits
  const handleDoubtSearch = (e) => {
    e.preventDefault();
    const trimmed = doubt.trim();
    if (!trimmed) {
      return handleError('Please describe your doubt first');
    }
    // later ML can use this text; for now just pass it in query param
    navigate(`/experts?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <div className="xpert-container">
        {/* Top bar */}
        <div className="xpert-topbar">
  <div className="xpert-logo">XpertLink</div>
  <div className="xpert-topbar-right">
    <span className="xpert-username">
      {loggedInUser ? `Hi, ${loggedInUser}` : 'Learner'}
      {role === 'expert' ? ' (Expert)' : ''}
    </span>

    {role === 'expert' && (
      <button
        className="xpert-logout-btn"
        style={{ marginRight: '8px' }}
        onClick={() => navigate('/expert-dashboard')}
      >
        Expert dashboard
      </button>
    )}

    <button className="xpert-logout-btn" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>


        {/* Header hero */}
        <header className="xpert-header">
          <h1 className="xpert-greeting">Welcome, {loggedInUser || 'learner'}!</h1>
          <p className="xpert-subtitle">
            Describe your doubt and we&apos;ll surface experts who can help you in real time.
          </p>

          {/* 🔍 Doubt search bar styled like a CTA */}
          <form
            onSubmit={handleDoubtSearch}
            style={{
              marginTop: '18px',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <input
              type="text"
              placeholder="e.g. React state not updating, DP problem stuck..."
              value={doubt}
              onChange={(e) => setDoubt(e.target.value)}
              style={{
                padding: '12px 16px',
                borderRadius: '999px',
                border: '1px solid #ffb199',
                width: '100%',
                maxWidth: '420px',
                fontSize: '0.95rem'
              }}
            />
            <button
              type="submit"
              className="xpert-cta-btn"
              style={{ marginTop: 0 }}
            >
              Find experts for your doubts
            </button>
          </form>
        </header>

        {/* Explore skills */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Explore Skills</h2>
          <div className="xpert-grid">
            <div className="xpert-card xpert-category-card">
              <div className="xpert-category-icon">💻</div>
              <div className="xpert-category-title">Web Development</div>
            </div>
            <div className="xpert-card xpert-category-card">
              <div className="xpert-category-icon">📊</div>
              <div className="xpert-category-title">Data Structures</div>
            </div>
            <div className="xpert-card xpert-category-card">
              <div className="xpert-category-icon">🐍</div>
              <div className="xpert-category-title">Python</div>
            </div>
            <div className="xpert-card xpert-category-card">
              <div className="xpert-category-icon">✂️</div>
              <div className="xpert-category-title">Editing</div>
            </div>
          </div>
        </section>

        {/* Recommended experts */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Recommended Experts</h2>
          <div className="xpert-grid">
            {recommendedExperts.length === 0 ? (
              <div className="xpert-empty-text">No experts available yet.</div>
            ) : (
              recommendedExperts.map((exp, index) => (
                <div key={exp._id || index} className="xpert-card xpert-expert-card">
                  <div className="xpert-expert-photo">
                    {exp.name?.charAt(0) || 'X'}
                  </div>
                  <div className="xpert-expert-name">{exp.name}</div>
                  <div className="xpert-stars">
                    ⭐
                    <span className="xpert-rating">
                      {exp.rating != null ? exp.rating.toFixed(1) : '5.0'}
                    </span>
                  </div>
                  <div className="xpert-price">₹{exp.price} / session</div>
                  <button
                    className="xpert-connect-btn"
                    onClick={() =>
                      handleSuccess(`Connecting you with ${exp.name} soon...`)
                    }
                  >
                    Connect Now
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent sessions */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Recent Sessions</h2>
          <div className="xpert-grid">
            {recentSessions.map((session, index) => (
              <div key={index} className="xpert-card xpert-session-card">
                <div className="xpert-session-title">{session.title}</div>
                <div className="xpert-session-meta">
                  <span>👤 {session.name}</span>
                  <span>{session.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ToastContainer />
    </>
  );
}

export default Home;
