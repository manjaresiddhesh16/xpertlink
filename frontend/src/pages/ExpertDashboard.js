import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../utils';

function ExpertDashboard() {
  const [expertName, setExpertName] = useState('');
  const [role, setRole] = useState('');

  const [stats, setStats] = useState({
    monthlyIncome: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    rating: 4.8,
  });

  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);

  const API_BASE = 'http://localhost:8080';

  const fetchSessions = async () => {
    try {
      const url = `${API_BASE}/sessions/mine`;
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Expert sessions raw:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Could not parse /sessions/mine JSON');
        return;
      }

      if (!response.ok || !result.success) {
        console.error('Sessions API error:', result);
        return;
      }

      const all = result.sessions || [];
      console.log('Sessions parsed:', all);

      const upcoming = all.filter(
        (s) => s.status === 'pending' || s.status === 'accepted'
      );
      const past = all.filter(
        (s) => s.status === 'completed' || s.status === 'rejected'
      );

      setUpcomingSessions(upcoming);
      setPastSessions(past);

      const totalEarnings = past.reduce(
        (sum, s) => sum + (s.price || 400),
        0
      );
      setStats({
        monthlyIncome: totalEarnings,
        totalSessions: all.length,
        upcomingSessions: upcoming.length,
        rating: 4.8,
      });
    } catch (err) {
      console.error('Fetch sessions error:', err);
    }
  };

  const buildMeetingLink = (session) => {
    // use backend value if present, otherwise fallback pattern
    return (
      session.meetingLink ||
      `https://meet.jit.si/xpertlink-${session._id}`
    );
  };

  const handleAcceptSession = async (sessionId) => {
    console.log('Clicked ACCEPT for', sessionId);
    try {
      const url = `${API_BASE}/sessions/${sessionId}/accept`;
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Accept session raw:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Could not parse accept-session JSON');
        return;
      }

      if (response.ok && result.success) {
        handleSuccess('Session accepted');
        const session = result.session;

        if (session) {
          const link = buildMeetingLink(session);
          console.log('Opening meeting link for expert:', link);
          window.open(link, '_blank', 'noopener,noreferrer');
        }

        fetchSessions();
      } else {
        handleError(result.message || 'Failed to accept session');
      }
    } catch (err) {
      console.error('Accept session error:', err);
    }
  };

  const handleRejectSession = async (sessionId) => {
    console.log('Clicked REJECT for', sessionId);
    try {
      const url = `${API_BASE}/sessions/${sessionId}/reject`;
      const token = localStorage.getItem('token');

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      console.log('Reject session raw:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Could not parse reject-session JSON');
        return;
      }

      if (response.ok && result.success) {
        handleSuccess('Session rejected');
        fetchSessions();
      } else {
        handleError(result.message || 'Failed to reject session');
      }
    } catch (err) {
      console.error('Reject session error:', err);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem('loggedInUser') || 'Expert';
    const storedRole = localStorage.getItem('role') || '';
    setExpertName(name);
    setRole(storedRole);

    fetchSessions();

    const intervalId = setInterval(fetchSessions, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCopyProfileLink = () => {
    handleSuccess('Profile link copied to clipboard (demo)');
  };

  return (
    <>
      <div className="xpert-container">
        {/* Top bar */}
        <div className="xpert-topbar">
          <div className="xpert-logo">XpertLink</div>
          <div className="xpert-topbar-right">
            <span className="xpert-username">
              {expertName} {role === 'expert' ? '(Expert)' : ''}
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="xpert-header expert-header">
          <h1 className="xpert-greeting">Expert Dashboard</h1>
          <p className="xpert-subtitle">
            Track your upcoming sessions, earnings and performance at a glance.
          </p>
          <button
            className="xpert-cta-btn"
            onClick={handleCopyProfileLink}
          >
            Copy your public profile link
          </button>
        </header>

        {/* Stats row */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Overview</h2>
          <div className="expert-stats-grid">
            <div className="xpert-card expert-stat-card">
              <div className="expert-stat-label">This month&apos;s income</div>
              <div className="expert-stat-value">₹{stats.monthlyIncome}</div>
              <div className="expert-stat-sub">
                Across {stats.totalSessions} sessions
              </div>
            </div>
            <div className="xpert-card expert-stat-card">
              <div className="expert-stat-label">Upcoming sessions</div>
              <div className="expert-stat-value">
                {stats.upcomingSessions}
              </div>
              <div className="expert-stat-sub">Next 24 hours</div>
            </div>
            <div className="xpert-card expert-stat-card">
              <div className="expert-stat-label">Average rating</div>
              <div className="expert-stat-value">
                ⭐ {stats.rating.toFixed(1)}
              </div>
              <div className="expert-stat-sub">Based on recent feedback</div>
            </div>
          </div>
        </section>

        {/* Upcoming sessions */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Upcoming sessions</h2>
          {upcomingSessions.length === 0 ? (
            <p className="expert-empty-text">
              No upcoming sessions scheduled.
            </p>
          ) : (
            <div className="expert-table">
              <div className="expert-table-header">
                <span>Session ID</span>
                <span>Learner</span>
                <span>Topic</span>
                <span>When</span>
                <span>Price</span>
                <span>Actions</span>
              </div>

              {upcomingSessions.map((s) => (
                <div key={s._id} className="expert-table-row">
                  <span>{s._id.slice(-6)}</span>
                  <span>{s.learnerId?.name || 'Learner'}</span>
                  <span>{s.topic}</span>
                  <span>{new Date(s.createdAt).toLocaleString()}</span>
                  <span>{s.price ? `₹${s.price}` : '-'}</span>

                  <span style={{ display: 'flex', gap: '8px' }}>
                    {s.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          className="expert-status-badge"
                          style={{
                            background: '#dcfce7',
                            color: '#166534',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleAcceptSession(s._id)}
                        >
                          Accept & start call
                        </button>

                        <button
                          type="button"
                          className="expert-status-badge"
                          style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleRejectSession(s._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {s.status !== 'pending' && (
                      <span className="expert-status-badge">
                        {s.status}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past sessions */}
        <section className="xpert-section">
          <h2 className="xpert-section-title">Recent sessions</h2>
          {pastSessions.length === 0 ? (
            <p className="expert-empty-text">No past sessions to show.</p>
          ) : (
            <div className="expert-table">
              <div className="expert-table-header">
                <span>Session ID</span>
                <span>Learner</span>
                <span>Topic</span>
                <span>When</span>
                <span>Earnings</span>
                <span>Status</span>
              </div>
              {pastSessions.map((s) => (
                <div key={s._id} className="expert-table-row">
                  <span>{s._id.slice(-6)}</span>
                  <span>{s.learnerId?.name || 'Learner'}</span>
                  <span>{s.topic}</span>
                  <span>{new Date(s.updatedAt || s.createdAt).toLocaleString()}</span>
                  <span>₹{s.price || 400}</span>
                  <span className="expert-status-badge">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <ToastContainer />
    </>
  );
}

export default ExpertDashboard;
