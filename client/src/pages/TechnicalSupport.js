import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TechnicalSupport.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function TechnicalSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    issueType: '',
    description: '',
    priority: 'Medium'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/technical-support`, formData, {
        timeout: 15000
      });

      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          issueType: '',
          description: '',
          priority: 'Medium'
        });
      } else {
        setError(response.data.message || 'Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.response?.data?.message || 'Failed to submit report. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="technical-support-page">
        <div className="technical-support-container">
          <div className="success-message">
            <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2>Report Submitted Successfully!</h2>
            <p>Thank you for reporting the issue. Our technical support team has been notified and will review your report.</p>
            <p>We will contact you at <strong>{formData.email}</strong> if we need additional information.</p>
            <div className="success-actions">
              <Link to="/" className="btn-primary">Back to Home</Link>
              <button 
                onClick={() => setSubmitted(false)} 
                className="btn-secondary"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="technical-support-page">
      <div className="technical-support-container">
        <header className="support-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>
            <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="9" y1="10" x2="15" y2="10"></line>
              <line x1="9" y1="14" x2="13" y2="14"></line>
            </svg>
            Technical Support
          </h1>
          <p className="support-subtitle">Report issues or problems with the system</p>
        </header>

        <div className="support-content">
          <div className="support-info">
            <h2>Report a Problem</h2>
            <p>
              If you encounter any issues, bugs, or problems while using the BSIT Graduate Tracer System, 
              please fill out the form below. Our technical support team will review your report and work 
              to resolve the issue as soon as possible.
            </p>
            <div className="info-box">
              <h3>What to Include:</h3>
              <ul>
                <li>Clear description of the problem</li>
                <li>Steps to reproduce the issue (if applicable)</li>
                <li>What you were trying to do when the problem occurred</li>
                <li>Any error messages you received</li>
                <li>Your contact information for follow-up</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="support-form">
            {error && (
              <div className="error-message">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
              <small>We'll use this to contact you about your report</small>
            </div>

            <div className="form-group">
              <label>Issue Type *</label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select issue type</option>
                <option value="Bug">Bug / Error</option>
                <option value="Performance">Performance Issue</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Security">Security Concern</option>
                <option value="Data">Data Issue</option>
                <option value="Access">Access / Login Problem</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low - Minor issue, can wait</option>
                <option value="Medium">Medium - Normal priority</option>
                <option value="High">High - Affects functionality</option>
                <option value="Critical">Critical - System unusable</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief description of the issue"
                maxLength="200"
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="8"
                placeholder="Please provide a detailed description of the issue, including steps to reproduce (if applicable), what you expected to happen, and what actually happened..."
                maxLength="2000"
              />
              <small>{formData.description.length} / 2000 characters</small>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Report
                  </>
                )}
              </button>
              <Link to="/" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TechnicalSupport;

