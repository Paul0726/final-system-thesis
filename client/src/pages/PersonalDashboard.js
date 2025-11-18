import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PersonalDashboard.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function PersonalDashboard() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || localStorage.getItem('userEmail') || '');
  const [survey, setSurvey] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('userToken');
    const storedEmail = localStorage.getItem('userEmail');
    if (token && storedEmail) {
      setIsAuthenticated(true);
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const fetchSurvey = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${API_URL}/survey/email/${encodeURIComponent(email)}`);
      if (response.data.success) {
        setSurvey(response.data.data);
        setFormData(response.data.data);
      } else {
        setMessage('Survey not found for this email address.');
      }
    } catch (error) {
      console.error('Error fetching survey:', error);
      setMessage(error.response?.data?.message || 'Error loading survey. Please check your email address.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchSurvey();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const response = await axios.put(`${API_URL}/survey/${survey.id}`, formData);
      if (response.data.success) {
        setMessage('Survey updated successfully!');
        setSurvey(formData);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setMessage(error.response?.data?.message || 'Error updating survey. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="personal-dashboard-page">
        <div className="personal-dashboard-container">
          <div className="email-access-form">
            <h2>Authentication Required</h2>
            <p>Please login to access your personal dashboard.</p>
            <Link to="/login" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Go to Login Page
            </Link>
            <Link to="/" className="btn-secondary" style={{ marginTop: '15px', display: 'inline-block' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="personal-dashboard-page">
        <div className="personal-dashboard-container">
          <div className="email-access-form">
            <h2>Access Your Personal Dashboard</h2>
            <p>Enter your email address to access and edit your survey responses.</p>
            <Link to="/login" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
              Login to Access
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="personal-dashboard-page">
        <div className="personal-dashboard-container">
          <div className="loading">Loading your survey...</div>
        </div>
      </div>
    );
  }

  if (!survey || !formData) {
    return (
      <div className="personal-dashboard-page">
        <div className="personal-dashboard-container">
          <div className="email-access-form">
            <h2>Survey Not Found</h2>
            <p>{message || 'No survey found for this email address.'}</p>
            <button onClick={() => { setEmail(''); setSurvey(null); setFormData(null); }} className="btn-primary">
              Try Different Email
            </button>
            <Link to="/survey" className="btn-secondary" style={{ marginTop: '15px', display: 'inline-block' }}>
              Submit New Survey
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="personal-dashboard-page">
      <div className="personal-dashboard-container">
        <header className="personal-dashboard-header">
          <div className="header-top">
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
          <h1>My Personal Dashboard</h1>
          <p>Edit your survey responses</p>
          {message && (
            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="personal-dashboard-form">
          {/* Display Alumni Status */}
          <div className="alumni-status-display">
            <h3>Alumni Status</h3>
            <div className="status-info">
              <p><strong>Is Alumni:</strong> {survey.isAlumni === 'Yes' ? 'Yes' : 'No'}</p>
              {survey.isAlumni !== 'Yes' && (
                <p><strong>Interested in Alumni Registration:</strong> {survey.interestedAlumni === 'Yes' ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="emailAddress" value={formData.emailAddress || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input type="text" name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Sex</label>
              <select name="sex" value={formData.sex || ''} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label>Civil Status</label>
              <select name="civilStatus" value={formData.civilStatus || ''} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>
            <div className="form-group">
              <label>Permanent Address</label>
              <textarea name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} rows="3" />
            </div>
            <div className="form-group">
              <label>Current Location</label>
              <input type="text" name="currentLocation" value={formData.currentLocation || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Education */}
          <div className="form-section">
            <h2>Education</h2>
            <div className="form-group">
              <label>Course Graduated</label>
              <input type="text" name="courseGraduated" value={formData.courseGraduated || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>School Year Graduated</label>
              <input type="text" name="schoolYearGraduated" value={formData.schoolYearGraduated || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Max Academic Achievement</label>
              <input type="text" name="maxAcademicAchievement" value={formData.maxAcademicAchievement || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Employment */}
          <div className="form-section">
            <h2>Employment</h2>
            <div className="form-group">
              <label>Is Employed</label>
              <select name="isEmployed" value={formData.isEmployed || ''} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Employment Nature</label>
              <select name="employmentNature" value={formData.employmentNature || ''} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Government Sector">Government Sector</option>
                <option value="Private Sector">Private Sector</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Further Studies">Further Studies</option>
                <option value="Not Currently Employed">Not Currently Employed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Place of Work</label>
              <input type="text" name="placeOfWork" value={formData.placeOfWork || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Is your work in the IT (Information Technology) field?</label>
              <select name="isITField" value={formData.isITField || ''} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Income</label>
              <select name="monthlyIncome" value={formData.monthlyIncome || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Less than ₱10,000">Less than ₱10,000</option>
                <option value="₱10,000 – ₱19,999">₱10,000 – ₱19,999</option>
                <option value="₱20,000 – ₱29,999">₱20,000 – ₱29,999</option>
                <option value="₱30,000 – ₱39,999">₱30,000 – ₱39,999</option>
                <option value="₱40,000 – ₱49,999">₱40,000 – ₱49,999</option>
                <option value="₱50,000 – ₱59,999">₱50,000 – ₱59,999</option>
                <option value="₱60,000 – ₱69,999">₱60,000 – ₱69,999</option>
                <option value="₱70,000 – ₱79,999">₱70,000 – ₱79,999</option>
                <option value="₱80,000 – ₱89,999">₱80,000 – ₱89,999</option>
                <option value="₱90,000 – ₱99,999">₱90,000 – ₱99,999</option>
                <option value="₱100,000 and above">₱100,000 and above</option>
                {/* Backward compatibility: Show old value if it exists and is not in the list above */}
                {formData.monthlyIncome && 
                 formData.monthlyIncome !== '' && 
                 !['Less than ₱10,000', '₱10,000 – ₱19,999', '₱20,000 – ₱29,999', '₱30,000 – ₱39,999', '₱40,000 – ₱49,999', '₱50,000 – ₱59,999', '₱60,000 – ₱69,999', '₱70,000 – ₱79,999', '₱80,000 – ₱89,999', '₱90,000 – ₱99,999', '₱100,000 and above'].includes(formData.monthlyIncome) && (
                  <option value={formData.monthlyIncome}>{formData.monthlyIncome} (Current Value)</option>
                )}
              </select>
            </div>
          </div>

          {/* Ratings and Feedback */}
          <div className="form-section">
            <h2>Ratings and Feedback</h2>
            <div className="form-group">
              <label>School Rating (1-5)</label>
              <input type="number" name="schoolRating" min="1" max="5" value={formData.schoolRating || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>School Feedback</label>
              <textarea name="schoolFeedback" value={formData.schoolFeedback || ''} onChange={handleChange} rows="4" />
            </div>
            <div className="form-group">
              <label>System Rating (1-5)</label>
              <input type="number" name="systemRating" min="1" max="5" value={formData.systemRating || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>System Feedback</label>
              <textarea name="systemFeedback" value={formData.systemFeedback || ''} onChange={handleChange} rows="4" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link to="/" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonalDashboard;

