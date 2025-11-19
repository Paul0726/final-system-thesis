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
        const surveyData = response.data.data;
        // Ensure trainings is an array
        if (!surveyData.trainings || !Array.isArray(surveyData.trainings)) {
          surveyData.trainings = surveyData.trainings ? [surveyData.trainings] : [{ title: '', duration: '', trainer: '' }];
        }
        // Ensure ratings object exists
        if (!surveyData.ratings) {
          surveyData.ratings = {
            jobPlacement: { q1: '', q2: '', q3: '', q4: '' },
            itField: { q1: '', q2: '', q3: '', q4: '' },
            competitiveEdge: { q1: '', q2: '', q3: '', q4: '' },
            workplace: { q1: '', q2: '', q3: '', q4: '' }
          };
        }
        setSurvey(surveyData);
        setFormData(surveyData);
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

  // Parse conditional fields when survey data is loaded
  useEffect(() => {
    if (survey && formData) {
      // Parse LET License
      if (formData.letLicense && formData.letLicense.includes('Yes') && formData.letLicense.includes('-')) {
        const parts = formData.letLicense.split(' - ');
        if (parts.length >= 3) {
          setFormData(prev => ({
            ...prev,
            letLicense: 'Yes - With License Number',
            letLicenseNumber: parts.slice(2).join(' - ')
          }));
        }
      }
      
      // Parse Other PRC License
      if (formData.otherPRCLicense && formData.otherPRCLicense.includes('Yes') && formData.otherPRCLicense.includes('-')) {
        const parts = formData.otherPRCLicense.split(' - ');
        if (parts.length >= 3) {
          setFormData(prev => ({
            ...prev,
            otherPRCLicense: 'Yes - With License Number',
            otherPRCLicenseNumber: parts.slice(2).join(' - ')
          }));
        }
      }
      
      // Parse Professional Organizations
      if (formData.professionalOrganizations && formData.professionalOrganizations.includes('Yes') && formData.professionalOrganizations.includes(':')) {
        const parts = formData.professionalOrganizations.split(': ');
        if (parts.length >= 2) {
          setFormData(prev => ({
            ...prev,
            professionalOrganizations: 'Yes - Member',
            professionalOrganizationsList: parts.slice(1).join(': ')
          }));
        }
      }
      
      // Parse Additional Revenue Sources
      if (formData.additionalRevenueSources && formData.additionalRevenueSources.startsWith('Yes') && formData.additionalRevenueSources.includes(':')) {
        const parts = formData.additionalRevenueSources.split(': ');
        if (parts.length >= 2) {
          setFormData(prev => ({
            ...prev,
            additionalRevenueSources: parts[0],
            additionalRevenueSourcesDetails: parts.slice(1).join(': ')
          }));
        }
      }
    }
  }, [survey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTrainingChange = (index, field, value) => {
    setFormData(prev => {
      const newTrainings = [...(prev.trainings || [])];
      if (!newTrainings[index]) {
        newTrainings[index] = { title: '', duration: '', trainer: '' };
      }
      newTrainings[index][field] = value;
      return {
        ...prev,
        trainings: newTrainings
      };
    });
  };

  const addTraining = () => {
    setFormData(prev => ({
      ...prev,
      trainings: [...(prev.trainings || []), { title: '', duration: '', trainer: '' }]
    }));
  };

  const removeTraining = (index) => {
    setFormData(prev => ({
      ...prev,
      trainings: (prev.trainings || []).filter((_, i) => i !== index)
    }));
  };

  const handleRatingChange = (section, question, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...(prev.ratings || {}),
        [section]: {
          ...(prev.ratings?.[section] || {}),
          [question]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      // Format data similar to survey submission
      const submitData = {
        ...formData,
        // Handle conditional fields
        letLicense: formData.letLicense === 'Yes - With License Number' && formData.letLicenseNumber 
          ? `${formData.letLicense} - ${formData.letLicenseNumber}` 
          : formData.letLicense,
        otherPRCLicense: formData.otherPRCLicense === 'Yes - With License Number' && formData.otherPRCLicenseNumber 
          ? `${formData.otherPRCLicense} - ${formData.otherPRCLicenseNumber}` 
          : formData.otherPRCLicense,
        professionalOrganizations: formData.professionalOrganizations === 'Yes - Member' && formData.professionalOrganizationsList
          ? `${formData.professionalOrganizations}: ${formData.professionalOrganizationsList}`
          : formData.professionalOrganizations,
        additionalRevenueSources: formData.additionalRevenueSources && formData.additionalRevenueSources.startsWith('Yes') && formData.additionalRevenueSourcesDetails
          ? `${formData.additionalRevenueSources}: ${formData.additionalRevenueSourcesDetails}`
          : formData.additionalRevenueSources
      };

      const response = await axios.put(`${API_URL}/survey/${survey.id}`, submitData);
      if (response.data.success) {
        setMessage('Survey updated successfully!');
        setSurvey(response.data.data);
        setFormData(response.data.data);
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
              <select name="courseGraduated" value={formData.courseGraduated || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="BSIT">Bachelor of Science in Information Technology (BSIT)</option>
                <option value="BSIT Multimedia">Bachelor of Science in Information Technology with specialization in Multimedia Systems</option>
                <option value="BSIT Animation">Bachelor of Science in Information Technology with specialization in Animation & Game Development</option>
              </select>
            </div>
            <div className="form-group">
              <label>School Year Graduated</label>
              <select name="schoolYearGraduated" value={formData.schoolYearGraduated || ''} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="form-group">
              <label>Max Academic Achievement</label>
              <select name="maxAcademicAchievement" value={formData.maxAcademicAchievement || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate Degree">Doctorate Degree</option>
                <option value="Post-Graduate Diploma">Post-Graduate Diploma</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trainings and Seminars</label>
              <small style={{ display: 'block', marginBottom: '10px', color: '#666' }}>Add training entries you've attended</small>
              {(formData.trainings || []).map((training, index) => (
                <div key={index} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
                    <div>
                      <label>Title</label>
                      <input 
                        type="text" 
                        value={training.title || ''} 
                        onChange={(e) => handleTrainingChange(index, 'title', e.target.value)}
                        placeholder="Training title"
                      />
                    </div>
                    <div>
                      <label>Duration</label>
                      <input 
                        type="text" 
                        value={training.duration || ''} 
                        onChange={(e) => handleTrainingChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 40 hours"
                      />
                    </div>
                    <div>
                      <label>Trainer/Institution</label>
                      <input 
                        type="text" 
                        value={training.trainer || ''} 
                        onChange={(e) => handleTrainingChange(index, 'trainer', e.target.value)}
                        placeholder="Trainer name"
                      />
                    </div>
                    {(formData.trainings || []).length > 1 && (
                      <button type="button" onClick={() => removeTraining(index)} style={{ padding: '8px 15px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTraining} style={{ padding: '10px 20px', background: '#11823b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                + Add Training
              </button>
            </div>

            <div className="form-group">
              <label>Civil Service</label>
              <select name="civilService" value={formData.civilService || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - Professional">Yes - Professional</option>
                <option value="Yes - Sub Professional">Yes - Sub Professional</option>
                <option value="No">No - Not yet taken</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
            </div>

            <div className="form-group">
              <label>LET License</label>
              <select name="letLicense" value={formData.letLicense || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - With License Number">Yes - I have LET License</option>
                <option value="No">No - Not yet taken</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {formData.letLicense && formData.letLicense.includes('Yes') && (
                <input 
                  type="text" 
                  name="letLicenseNumber" 
                  value={formData.letLicenseNumber || ''} 
                  onChange={handleChange} 
                  placeholder="Enter LET License Number (optional)"
                  style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Other Professional License under PRC</label>
              <select name="otherPRCLicense" value={formData.otherPRCLicense || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - With License Number">Yes - I have PRC License</option>
                <option value="No">No - None</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {formData.otherPRCLicense && formData.otherPRCLicense.includes('Yes') && (
                <input 
                  type="text" 
                  name="otherPRCLicenseNumber" 
                  value={formData.otherPRCLicenseNumber || ''} 
                  onChange={handleChange} 
                  placeholder="Enter PRC License Number (optional)"
                  style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Professional Organizations</label>
              <select name="professionalOrganizations" value={formData.professionalOrganizations || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - Member">Yes - I am a member</option>
                <option value="No">No - Not a member</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {formData.professionalOrganizations && formData.professionalOrganizations.includes('Yes') && (
                <textarea 
                  name="professionalOrganizationsList" 
                  value={formData.professionalOrganizationsList || ''} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="List the professional organizations you are involved in"
                  style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                />
              )}
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
                <option value="Not Currently Employed">Not Currently Employed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Employment Classification</label>
              <select name="employmentClassification" value={formData.employmentClassification || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Regular/Permanent Employee">Regular/Permanent Employee</option>
                <option value="Probationary">Probationary</option>
                <option value="Casual/Seasonal">Casual/Seasonal</option>
                <option value="Contractual">Contractual</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input type="text" name="jobTitle" value={formData.jobTitle || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Place of Work</label>
              <div style={{ display: 'flex', gap: '15px' }}>
                <label><input type="radio" name="placeOfWork" value="Local" checked={formData.placeOfWork === 'Local'} onChange={handleChange} /> Local</label>
                <label><input type="radio" name="placeOfWork" value="Abroad" checked={formData.placeOfWork === 'Abroad'} onChange={handleChange} /> Abroad</label>
              </div>
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
            <div className="form-group">
              <label>Additional Revenue Sources</label>
              <select name="additionalRevenueSources" value={formData.additionalRevenueSources || ''} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - Freelance Work">Yes - Freelance Work</option>
                <option value="Yes - Business/Entrepreneurship">Yes - Business/Entrepreneurship</option>
                <option value="Yes - Part-time Job">Yes - Part-time Job</option>
                <option value="Yes - Investments">Yes - Investments</option>
                <option value="No">No - None</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {formData.additionalRevenueSources && formData.additionalRevenueSources.startsWith('Yes') && (
                <textarea 
                  name="additionalRevenueSourcesDetails" 
                  value={formData.additionalRevenueSourcesDetails || ''} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Please specify details about your additional revenue sources"
                  style={{ marginTop: '10px', width: '100%', padding: '8px' }}
                />
              )}
            </div>
          </div>

          {/* Ratings Section */}
          <div className="form-section">
            <h2>After Study Status - Ratings</h2>
            <p style={{ marginBottom: '20px', color: '#666' }}>Rate from 1 (Disagree) to 5 (Strongly Agree)</p>

            {/* Job Placement */}
            <div style={{ marginBottom: '30px' }}>
              <h3>1. Job Placement</h3>
              {[
                { q: 'q1', text: 'My BSIT degree adequately prepared me for the demands of my current job.' },
                { q: 'q2', text: 'The technical skills I learned during my BSIT studies are directly applicable to my current work.' },
                { q: 'q3', text: 'I was able to secure employment in the IT field within a reasonable time after graduation.' },
                { q: 'q4', text: 'The BSIT program provided me with valuable opportunities for internships or on-the-job training that contributed to my job placement.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{item.text}</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`jobPlacement_${item.q}`} 
                          value={num} 
                          checked={(formData.ratings?.jobPlacement?.[item.q] || '') === String(num)} 
                          onChange={(e) => handleRatingChange('jobPlacement', item.q, e.target.value)} 
                        />
                        <span style={{ marginLeft: '5px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* IT Field */}
            <div style={{ marginBottom: '30px' }}>
              <h3>2. Information Technology Field</h3>
              {[
                { q: 'q1', text: 'The Information Technology field offers many career opportunities for graduates.' },
                { q: 'q2', text: 'Continuous learning and skill development are essential to succeed in the IT industry.' },
                { q: 'q3', text: 'Working in the Information Technology field provides competitive compensation and benefits.' },
                { q: 'q4', text: 'The IT industry plays a vital role in the growth and development of the economy.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{item.text}</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`itField_${item.q}`} 
                          value={num} 
                          checked={(formData.ratings?.itField?.[item.q] || '') === String(num)} 
                          onChange={(e) => handleRatingChange('itField', item.q, e.target.value)} 
                        />
                        <span style={{ marginLeft: '5px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Competitive Edge */}
            <div style={{ marginBottom: '30px' }}>
              <h3>3. Competitive Edge as a graduate of BSIT Program</h3>
              {[
                { q: 'q1', text: 'My BSIT education has given me a competitive advantage over graduates from other programs.' },
                { q: 'q2', text: 'I feel confident in my ability to solve complex IT problems because of my BSIT training.' },
                { q: 'q3', text: 'The skills I acquired in the BSIT program are in high demand in the job market.' },
                { q: 'q4', text: 'Employers recognize and value the quality of the BSIT program I completed.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{item.text}</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`competitiveEdge_${item.q}`} 
                          value={num} 
                          checked={(formData.ratings?.competitiveEdge?.[item.q] || '') === String(num)} 
                          onChange={(e) => handleRatingChange('competitiveEdge', item.q, e.target.value)} 
                        />
                        <span style={{ marginLeft: '5px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Workplace */}
            <div style={{ marginBottom: '30px' }}>
              <h3>4. Relationship with Workplace</h3>
              {[
                { q: 'q1', text: 'I feel respected and valued by my colleagues and supervisors at work.' },
                { q: 'q2', text: 'I feel a strong sense of belonging in my workplace.' },
                { q: 'q3', text: 'I am comfortable communicating openly with my team and management.' },
                { q: 'q4', text: 'I receive adequate support from my workplace when I encounter challenges.' }
              ].map((item, idx) => (
                <div key={idx} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{item.text}</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} style={{ cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name={`workplace_${item.q}`} 
                          value={num} 
                          checked={(formData.ratings?.workplace?.[item.q] || '') === String(num)} 
                          onChange={(e) => handleRatingChange('workplace', item.q, e.target.value)} 
                        />
                        <span style={{ marginLeft: '5px' }}>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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

