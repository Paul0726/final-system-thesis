import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function AdminPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await axios.delete(`${API_URL}/surveys/${id}`);
        fetchSurveys();
        alert('Survey deleted successfully!');
      } catch (error) {
        console.error('Error deleting survey:', error);
        alert('Error deleting survey');
      }
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = !searchTerm || 
      (survey.name && survey.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (survey.email && survey.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !filterStatus || survey.currentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Employed': return '#10b981';
      case 'Self-Employed': return '#3b82f6';
      case 'Further Studies': return '#8b5cf6';
      case 'Unemployed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>👨‍💼 Admin Panel</h1>
          <p>Manage BSIT Graduate Survey Data</p>
        </header>

        <div className="admin-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-bar">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Employed">Employed</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Further Studies">Further Studies</option>
              <option value="Unemployed">Unemployed</option>
            </select>
            <div className="admin-stats">
              <span>Total: {filteredSurveys.length}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading surveys...</div>
          ) : filteredSurveys.length === 0 ? (
            <div className="empty-state">
              <p>No surveys found.</p>
            </div>
          ) : (
            <div className="surveys-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Year Graduated</th>
                    <th>Status</th>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSurveys.map((survey, index) => (
                    <tr key={index}>
                      <td>{survey.name || 'N/A'}</td>
                      <td>{survey.yearGraduated || 'N/A'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(survey.currentStatus) }}
                        >
                          {survey.currentStatus || 'N/A'}
                        </span>
                      </td>
                      <td>{survey.company || 'N/A'}</td>
                      <td>{survey.position || 'N/A'}</td>
                      <td>{survey.email || 'N/A'}</td>
                      <td>{survey.contactNumber || 'N/A'}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(survey.id || index)}
                          className="btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-actions">
          <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
          <button onClick={fetchSurveys} className="btn-refresh">🔄 Refresh</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;

