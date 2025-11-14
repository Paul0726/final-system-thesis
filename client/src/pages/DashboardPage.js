import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchSurveys();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/surveys`);
      setSurveys(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>📊 Dashboard</h1>
          <p>BSIT Graduate Statistics and Insights</p>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalGraduates || 0}</h3>
                <p>Total Graduates</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <h3>{stats.employed || 0}</h3>
                <p>Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>{stats.selfEmployed || 0}</h3>
                <p>Self-Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.furtherStudies || 0}</h3>
                <p>Further Studies</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.unemployed || 0}</h3>
                <p>Unemployed</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          <div className="chart-section">
            <h2>Employment Status Distribution</h2>
            <div className="chart-placeholder">
              <p>📈 Chart visualization will be displayed here</p>
              <p className="chart-note">Employment statistics by status</p>
            </div>
          </div>

          <div className="recent-surveys">
            <h2>Recent Survey Responses</h2>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : surveys.length === 0 ? (
              <div className="empty-state">
                <p>No survey responses yet. Be the first to submit!</p>
                <Link to="/survey" className="btn-primary">Take Survey</Link>
              </div>
            ) : (
              <div className="surveys-list">
                {surveys.slice(0, 5).map((survey, index) => (
                  <div key={index} className="survey-item">
                    <div className="survey-header-item">
                      <h3>{survey.name || 'Anonymous'}</h3>
                      <span className={`status-badge ${survey.currentStatus?.toLowerCase().replace(' ', '-')}`}>
                        {survey.currentStatus}
                      </span>
                    </div>
                    <p className="survey-year">Graduated: {survey.yearGraduated}</p>
                    {survey.company && (
                      <p className="survey-company">Company: {survey.company}</p>
                    )}
                    {survey.position && (
                      <p className="survey-position">Position: {survey.position}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-actions">
          <Link to="/survey" className="btn-primary">Take Survey</Link>
          <Link to="/admin" className="btn-secondary">Admin Panel</Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

