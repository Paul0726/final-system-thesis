import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SurveyPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function SurveyPage() {
  const [formData, setFormData] = useState({
    name: '',
    yearGraduated: '',
    currentStatus: 'Employed',
    company: '',
    position: '',
    email: '',
    contactNumber: '',
    address: '',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/survey`, formData);
      setSubmitted(true);
      setFormData({
        name: '',
        yearGraduated: '',
        currentStatus: 'Employed',
        company: '',
        position: '',
        email: '',
        contactNumber: '',
        address: '',
        feedback: ''
      });
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="survey-page">
        <div className="survey-container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Thank You!</h2>
            <p>Your survey has been submitted successfully.</p>
            <Link to="/dashboard" className="btn-primary">View Dashboard</Link>
            <Link to="/survey" className="btn-secondary" onClick={() => setSubmitted(false)}>
              Submit Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <div className="survey-container">
        <header className="survey-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>📋 Graduate Survey Form</h1>
          <p>Help us track BSIT graduates by filling out this form</p>
        </header>

        <form onSubmit={handleSubmit} className="survey-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label>Full Name *</label>
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
              <label>Year Graduated *</label>
              <input
                type="number"
                name="yearGraduated"
                value={formData.yearGraduated}
                onChange={handleChange}
                required
                placeholder="e.g., 2023"
                min="2000"
                max="2030"
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
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="09XX XXX XXXX"
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your current address"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Employment Status</h2>
            <div className="form-group">
              <label>Current Status *</label>
              <select
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                required
              >
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Further Studies">Further Studies</option>
              </select>
            </div>

            {formData.currentStatus === 'Employed' && (
              <>
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="form-group">
                  <label>Position/Job Title</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Enter your position"
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-section">
            <h2>Feedback</h2>
            <div className="form-group">
              <label>Comments/Suggestions</label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Share your thoughts about the BSIT program..."
                rows="5"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Survey'}
            </button>
            <Link to="/" className="btn-cancel">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SurveyPage;

