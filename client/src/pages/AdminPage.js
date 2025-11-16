import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StarRating } from '../utils/helpers';
import './AdminPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const email = 'johnpauld750@gmail.com'; // Admin email (hardcoded for security)
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'year', 'name', 'gender'
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const authToken = localStorage.getItem('adminToken');
    if (authToken === 'admin-token') {
      setIsAuthenticated(true);
      fetchSurveys();
    }
  }, []);

  const handleSendOTP = async () => {
    try {
      setLoginLoading(true);
      const response = await axios.post(`${API_URL}/admin/send-otp`, { email });
      if (response.data.success) {
        setOtpSent(true);
        alert('OTP sent to your email! Please check your inbox.');
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoginLoading(true);
      const response = await axios.post(`${API_URL}/admin/verify-otp`, { email, otp });
      if (response.data.success) {
        localStorage.setItem('adminToken', 'admin-token');
        setIsAuthenticated(true);
        fetchSurveys();
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error: ' + (error.response?.data?.message || 'Invalid OTP. Please try again.'));
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setOtpSent(false);
    setOtp('');
  };

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/surveys`);
      console.log('API Response:', response.data);
      const surveysData = response.data.data || [];
      console.log('Surveys data:', surveysData);
      console.log('Number of surveys:', surveysData.length);
      if (surveysData.length > 0) {
        console.log('First survey:', surveysData[0]);
      }
      setSurveys(surveysData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Error loading surveys. Please check console for details.');
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

  // Extract last name for sorting
  const getLastName = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1] || '';
  };

  const filteredSurveys = surveys
    .filter(survey => {
      const matchesSearch = !searchTerm || 
        (survey.name && survey.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (survey.emailAddress && survey.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Determine status from isEmployed and employmentNature
      let surveyStatus = '';
      if (survey.isEmployed === 'Yes') {
        if (survey.employmentNature === 'Self-Employed') {
          surveyStatus = 'Self-Employed';
        } else if (survey.employmentNature === 'Further Studies') {
          surveyStatus = 'Further Studies';
        } else if (survey.employmentNature === 'Government Sector' || survey.employmentNature === 'Private Sector') {
          surveyStatus = 'Employed';
        } else {
          surveyStatus = 'Employed';
        }
      } else if (survey.isEmployed === 'No' || survey.employmentNature === 'Not Currently Employed') {
        surveyStatus = 'Unemployed';
      }
      
      const matchesStatus = !filterStatus || surveyStatus === filterStatus || !surveyStatus;
      const matchesGender = !filterGender || (survey.sex && survey.sex.toLowerCase() === filterGender.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesGender;
    })
    .sort((a, b) => {
      if (sortBy === 'year') {
        // Sort by graduation year (newest first, 2018-2024)
        const yearA = parseInt(a.schoolYearGraduated) || 0;
        const yearB = parseInt(b.schoolYearGraduated) || 0;
        return yearB - yearA; // Descending (newest first)
      } else if (sortBy === 'name') {
        // Sort alphabetically by last name
        const lastNameA = getLastName(a.name).toLowerCase();
        const lastNameB = getLastName(b.name).toLowerCase();
        return lastNameA.localeCompare(lastNameB);
      } else if (sortBy === 'gender') {
        // Sort by gender (Male first, then Female)
        const genderA = (a.sex || '').toLowerCase();
        const genderB = (b.sex || '').toLowerCase();
        if (genderA === 'male' && genderB !== 'male') return -1;
        if (genderA !== 'male' && genderB === 'male') return 1;
        return 0;
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Employed': return '#11823b';
      case 'Self-Employed': return '#3b82f6';
      case 'Further Studies': return '#8b5cf6';
      case 'Unemployed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="login-container">
            <div className="login-box">
              <h2>Admin Login</h2>
              <p>Request OTP to access admin panel</p>
              
              {!otpSent ? (
                <div className="login-form">
                  <div className="otp-request-info">
                    <p>Click the button below to receive a one-time password (OTP) via email.</p>
                  </div>
                  <button 
                    onClick={handleSendOTP} 
                    className="btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Sending OTP...' : '📧 Request OTP'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOTP} className="login-form">
                  <div className="otp-sent-message">
                    <p>✅ OTP has been sent to your registered email address.</p>
                    <p>Please check your inbox and enter the 6-digit code below.</p>
                  </div>
                  <div className="form-group">
                    <label>Enter OTP Code</label>
                    <input 
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      required
                      className="otp-input"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Verifying...' : '✓ Verify OTP'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="btn-secondary"
                  >
                    ← Request New OTP
                  </button>
                </form>
              )}
              
              <Link to="/" className="back-link">← Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div className="header-top">
            <Link to="/" className="back-link">← Back to Home</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
          <h1>Admin Panel</h1>
          <p>Manage BSIT Graduate Survey Data</p>
        </header>

        <div className="admin-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or email..."
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
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="filter-select"
            >
              <option value="">All Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="year">Sort by Year (Newest First)</option>
              <option value="name">Sort by Name (Alphabetical)</option>
              <option value="gender">Sort by Gender</option>
            </select>
            <div className="admin-stats">
              <span>Total: {filteredSurveys.length} / {surveys.length}</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Loading surveys...</div>
          ) : surveys.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h3>No Surveys Yet</h3>
              <p>There are no survey responses in the database.</p>
              <p>Submit a survey first to see data here.</p>
              <Link to="/survey" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                Go to Survey Page
              </Link>
            </div>
          ) : filteredSurveys.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <h3>No Results Found</h3>
              <p>No surveys match your search or filter criteria.</p>
              <button onClick={() => { setSearchTerm(''); setFilterStatus(''); }} className="btn-primary" style={{ marginTop: '20px' }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="surveys-list">
              {filteredSurveys.map((survey, index) => (
                <SurveyCard 
                  key={survey.id || index} 
                  survey={survey} 
                  index={index} 
                  onDelete={handleDelete} 
                  getStatusColor={getStatusColor} 
                />
              ))}
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

// Survey Card Component
function SurveyCard({ survey, index, onDelete, getStatusColor }) {
  const [expanded, setExpanded] = useState(false);
  
  // Determine status
  let surveyStatus = '';
  if (survey.isEmployed === 'Yes') {
    if (survey.employmentNature === 'Self-Employed') {
      surveyStatus = 'Self-Employed';
    } else if (survey.employmentNature === 'Further Studies') {
      surveyStatus = 'Further Studies';
    } else {
      surveyStatus = 'Employed';
    }
  } else if (survey.isEmployed === 'No' || survey.employmentNature === 'Not Currently Employed') {
    surveyStatus = 'Unemployed';
  }
  
  return (
    <div className="survey-card">
      <div className="survey-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="survey-card-main">
          <div>
            <h3>{survey.name || 'N/A'}</h3>
            <p className="survey-meta">
              {survey.schoolYearGraduated || 'N/A'} • {survey.sex || 'N/A'} • {survey.emailAddress || 'N/A'}
            </p>
          </div>
          <div className="survey-card-actions">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(surveyStatus) }}
            >
              {surveyStatus || 'N/A'}
            </span>
            {survey.isAlumni === 'Yes' && (
              <span className="alumni-badge" title="Alumni">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                Alumni
              </span>
            )}
            {survey.isAlumni === 'No' && survey.interestedAlumni === 'Yes' && (
              <span className="alumni-interest-badge" title="Wants to Register as Alumni">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                Wants to Register
              </span>
            )}
            {survey.isAlumni === 'No' && survey.interestedAlumni === 'No' && (
              <span className="alumni-no-badge" title="Not Alumni">
                Not Alumni
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(survey.id || index);
              }}
              className="btn-delete"
              title="Delete"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
              </svg>
            </button>
            <span className="expand-icon">{expanded ? '▼' : '▶'}</span>
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="survey-card-details">
          <div className="details-grid">
            <div className="detail-section">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {survey.name || 'N/A'}</p>
              <p><strong>Email:</strong> {survey.emailAddress || 'N/A'}</p>
              <p><strong>Mobile:</strong> {survey.mobileNumber || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {survey.dateOfBirth ? new Date(survey.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
              <p><strong>Age:</strong> {survey.age || 'N/A'}</p>
              <p><strong>Sex:</strong> {survey.sex || 'N/A'}</p>
              <p><strong>Civil Status:</strong> {survey.civilStatus || 'N/A'}</p>
              <p><strong>Permanent Address:</strong> {survey.permanentAddress || 'N/A'}</p>
              <p><strong>Current Location:</strong> {survey.currentLocation || 'N/A'}</p>
            </div>
            
            <div className="detail-section">
              <h4>Education</h4>
              <p><strong>Course Graduated:</strong> {survey.courseGraduated || 'N/A'}</p>
              <p><strong>School Year Graduated:</strong> {survey.schoolYearGraduated || 'N/A'}</p>
              <p><strong>Max Academic Achievement:</strong> {survey.maxAcademicAchievement || 'N/A'}</p>
              <p><strong>Civil Service:</strong> {survey.civilService || 'N/A'}</p>
              <p><strong>LET License:</strong> {survey.letLicense || 'N/A'}</p>
              <p><strong>Other PRC License:</strong> {survey.otherPRCLicense || 'N/A'}</p>
              <p><strong>Professional Organizations:</strong> {survey.professionalOrganizations || 'N/A'}</p>
            </div>
            
            <div className="detail-section">
              <h4>Employment</h4>
              <p><strong>Is Employed:</strong> {survey.isEmployed || 'N/A'}</p>
              <p><strong>Employment Nature:</strong> {survey.employmentNature || 'N/A'}</p>
              <p><strong>Employment Classification:</strong> {survey.employmentClassification || 'N/A'}</p>
              <p><strong>Job Title:</strong> {survey.jobTitle || 'N/A'}</p>
              <p><strong>Place of Work:</strong> {survey.placeOfWork || 'N/A'}</p>
              <p><strong>Monthly Income:</strong> {survey.monthlyIncome || 'N/A'}</p>
              <p><strong>Additional Revenue Sources:</strong> {survey.additionalRevenueSources || 'N/A'}</p>
            </div>
            
            <div className="detail-section">
              <h4>Alumni & Ratings</h4>
              <p><strong>Is Alumni:</strong> {survey.isAlumni === 'Yes' ? 'Yes (Alumni)' : survey.isAlumni === 'No' ? 'No (Not Alumni)' : 'N/A'}</p>
              {survey.isAlumni !== 'Yes' && (
                <p><strong>Interested in Alumni Registration:</strong> {survey.interestedAlumni === 'Yes' ? 'Yes (Wants to Register)' : survey.interestedAlumni === 'No' ? 'No (Not Interested)' : 'N/A'}</p>
              )}
              <p><strong>School Rating:</strong> {survey.schoolRating ? <><StarRating rating={survey.schoolRating} size="small" /> <span>({survey.schoolRating}/5)</span></> : 'N/A'}</p>
              <p><strong>System Rating:</strong> {survey.systemRating ? <><StarRating rating={survey.systemRating} size="small" /> <span>({survey.systemRating}/5)</span></> : 'N/A'}</p>
              <p><strong>School Feedback:</strong> {survey.schoolFeedback || 'N/A'}</p>
              <p><strong>System Feedback:</strong> {survey.systemFeedback || 'N/A'}</p>
            </div>
            
            {survey.trainings && Array.isArray(survey.trainings) && survey.trainings.length > 0 && (
              <div className="detail-section full-width">
                <h4>Trainings</h4>
                {survey.trainings.map((training, idx) => (
                  <div key={idx} className="training-item">
                    <p><strong>Title:</strong> {training.title || 'N/A'}</p>
                    <p><strong>Duration:</strong> {training.duration || 'N/A'}</p>
                    <p><strong>Trainer:</strong> {training.trainer || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;

