import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { handleSuccess } from '../utils';

function ExpertDashboard() {
  const [expertName, setExpertName] = useState('');
  const [role, setRole] = useState('');

  // In real app these will come from backend
  const [stats] = useState({
    monthlyIncome: 18250,
    totalSessions: 42,
    upcomingSessions: 3,
    rating: 4.8
  });

  const [upcomingSessions] = useState([
    {
      id: 'S-1042',
      learner: 'Rohan Sharma',
      topic: 'React useEffect loop',
      time: 'Today, 7:30 PM',
      duration: '45 min',
      status: 'Scheduled'
    },
    {
      id: 'S-1043',
      learner: 'Ananya Gupta',
      topic: 'DP on trees doubt',
      time: 'Tomorrow, 5:00 PM',
      duration: '60 min',
      status: 'Scheduled'
    },
    {
      id: 'S-1044',
      learner: 'Ishita Verma',
      topic: 'MongoDB aggregation help',
      time: 'Tomorrow, 8:00 PM',
      duration: '30 min',
      status: 'Scheduled'
    }
  ]);

  const [pastSessions] = useState([
    {
      id: 'S-1039',
      learner: 'Aditya Joshi',
      topic: 'CSS layout fix',
      time: '2 days ago',
      earnings: 450,
      rating: 5.0
    },
    {
      id: 'S-1038',
      learner: 'Meera Nair',
      topic: 'Binary search edge cases',
      time: '3 days ago',
      earnings: 400,
      rating: 4.5
    },
    {
      id: 'S-1037',
      learner: 'Harsh Patel',
      topic: 'REST API debugging',
      time: '5 days ago',
      earnings: 500,
      rating: 4.8
    }
  ]);

  useEffect(() => {
    const name = localStorage.getItem('loggedInUser') || 'Expert';
    const storedRole = localStorage.getItem('role') || '';
    setExpertName(name);
    setRole(storedRole);
  }, []);

  const handleCopyProfileLink = () => {
    // Fake copy for demo; later you can generate a real link
    handleSuccess('Profile link copied to clipboard (demo)');
  };

  return (
    <>
      <div className="xpert-container">
        {/* Top bar same style as learner home */}
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
              <div className="expert-stat-sub">Across {stats.totalSessions} sessions</div>
            </div>
            <div className="xpert-card expert-stat-card">
              <div className="expert-stat-label">Upcoming sessions</div>
              <div className="expert-stat-value">{stats.upcomingSessions}</div>
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
            <p className="expert-empty-text">No upcoming sessions scheduled.</p>
          ) : (
            <div className="expert-table">
              <div className="expert-table-header">
                <span>Session ID</span>
                <span>Learner</span>
                <span>Topic</span>
                <span>Time</span>
                <span>Duration</span>
                <span>Status</span>
              </div>
              {upcomingSessions.map((s) => (
                <div key={s.id} className="expert-table-row">
                  <span>{s.id}</span>
                  <span>{s.learner}</span>
                  <span>{s.topic}</span>
                  <span>{s.time}</span>
                  <span>{s.duration}</span>
                  <span className="expert-status-badge">{s.status}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past sessions & earnings */}
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
                <span>Rating</span>
              </div>
              {pastSessions.map((s) => (
                <div key={s.id} className="expert-table-row">
                  <span>{s.id}</span>
                  <span>{s.learner}</span>
                  <span>{s.topic}</span>
                  <span>{s.time}</span>
                  <span>₹{s.earnings}</span>
                  <span>⭐ {s.rating.toFixed(1)}</span>
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
