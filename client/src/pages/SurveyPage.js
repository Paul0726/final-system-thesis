import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SurveyPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function SurveyPage() {
  const [showAlumniModal, setShowAlumniModal] = useState(true);
  const [isAlumni, setIsAlumni] = useState('');
  const [interestedAlumni, setInterestedAlumni] = useState('');
  
  const [formData, setFormData] = useState({
    // A. Individual Information
    name: '',
    permanentAddress: '',
    mobileNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    age: '',
    civilStatus: '',
    sex: '',
    currentLocation: '',
    courseGraduated: '',
    schoolYearGraduated: '',
    
    // B. Profile Education
    maxAcademicAchievement: '',
    trainings: [{ title: '', duration: '', trainer: '' }],
    civilService: '',
    letLicense: '',
    otherPRCLicense: '',
    professionalOrganizations: '',
    
    // C. Employment Experiences
    isEmployed: '',
    employmentNature: '',
    employmentClassification: '',
    jobTitle: '',
    placeOfWork: '',
    monthlyIncome: '',
    additionalRevenueSources: '',
    
    // D. After Study Status - Ratings
    ratings: {
      jobPlacement: { q1: '', q2: '', q3: '', q4: '' },
      itField: { q1: '', q2: '', q3: '', q4: '' },
      competitiveEdge: { q1: '', q2: '', q3: '', q4: '' },
      workplace: { q1: '', q2: '', q3: '', q4: '' }
    },
    
    // E. Alumni Status & Ratings
    isAlumni: '',
    interestedAlumni: '',
    schoolRating: 0,
    systemRating: 0,
    schoolFeedback: '',
    systemFeedback: '',
    // Additional fields for conditional inputs
    letLicenseNumber: '',
    otherPRCLicenseNumber: '',
    professionalOrganizationsList: '',
    additionalRevenueSourcesDetails: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (section, question, value) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [section]: {
          ...prev.ratings[section],
          [question]: value
        }
      }
    }));
  };

  const handleTrainingChange = (index, field, value) => {
    const newTrainings = [...formData.trainings];
    newTrainings[index][field] = value;
    setFormData(prev => ({
      ...prev,
      trainings: newTrainings
    }));
  };

  const addTraining = () => {
    setFormData(prev => ({
      ...prev,
      trainings: [...prev.trainings, { title: '', duration: '', trainer: '' }]
    }));
  };

  const removeTraining = (index) => {
    setFormData(prev => ({
      ...prev,
      trainings: prev.trainings.filter((_, i) => i !== index)
    }));
  };

  const handleAlumniModal = () => {
    if (isAlumni === 'Yes') {
      setFormData(prev => ({ ...prev, isAlumni: 'Yes' }));
      setShowAlumniModal(false);
    } else if (isAlumni === 'No') {
      if (interestedAlumni === '') {
        // Show interested question - don't close modal yet
        return;
      } else if (interestedAlumni === 'Yes') {
        setFormData(prev => ({ 
          ...prev, 
          isAlumni: 'No',
          interestedAlumni: 'Yes'
        }));
        alert('Thank you for your interest! Your survey responses will be used as your alumni information.');
        setShowAlumniModal(false);
      } else if (interestedAlumni === 'No') {
        setFormData(prev => ({ 
          ...prev, 
          isAlumni: 'No',
          interestedAlumni: 'No'
        }));
        setShowAlumniModal(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        isAlumni: isAlumni,
        interestedAlumni: interestedAlumni === 'Yes' ? 'Yes' : (interestedAlumni === 'No' ? 'No' : null),
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
      
      const response = await axios.post(`${API_URL}/survey`, submitData);
      if (response.data.success) {
        setSubmitted(true);
      } else {
        alert('Error: ' + (response.data.message || 'Failed to submit survey'));
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error submitting survey. Please try again.';
      alert('Error: ' + errorMessage);
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

  // Alumni Modal
  if (showAlumniModal) {
    return (
      <div className="survey-page">
        <div className="alumni-modal-overlay">
          <div className="alumni-modal">
            <h2>Alumni Verification</h2>
            {interestedAlumni === '' ? (
              <>
                <p>Are you already an alumni of this institution?</p>
                <div className="modal-buttons">
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setIsAlumni('Yes');
                      handleAlumniModal();
                    }}
                  >
                    Yes, I am an Alumni
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setIsAlumni('No');
                      setInterestedAlumni('pending');
                    }}
                  >
                    No, I am not an Alumni
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Are you interested in becoming an alumni?</p>
                <p className="modal-note">If yes, your survey responses will be used as your alumni information.</p>
                <div className="modal-buttons">
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setInterestedAlumni('Yes');
                      handleAlumniModal();
                    }}
                  >
                    Yes, I'm Interested
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setInterestedAlumni('No');
                      handleAlumniModal();
                    }}
                  >
                    No, Not Interested
                  </button>
                </div>
              </>
            )}
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
          <h1>📋 BSIT Graduate Tracer Survey</h1>
          <p>Help us track and improve our BSIT program</p>
        </header>

        <form onSubmit={handleSubmit} className="survey-form">
          {/* A. INDIVIDUAL INFORMATION */}
          <div className="form-section">
            <h2>A. INDIVIDUAL INFORMATION</h2>
            
            <div className="form-group">
              <label>Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Permanent Address *</label>
              <textarea 
                name="permanentAddress" 
                value={formData.permanentAddress} 
                onChange={handleChange} 
                required 
                rows="2"
                placeholder="Enter your complete permanent address (e.g., Street, Barangay, City, Province)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number(s) *</label>
                <input 
                  type="tel" 
                  name="mobileNumber" 
                  value={formData.mobileNumber} 
                  onChange={handleChange} 
                  required
                  placeholder="e.g., 09123456789 or 0912-345-6789"
                />
              </div>

              <div className="form-group">
                <label>E-mail Address *</label>
                <input 
                  type="email" 
                  name="emailAddress" 
                  value={formData.emailAddress} 
                  onChange={handleChange} 
                  required
                  placeholder="e.g., yourname@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Age (as of last birthday) *</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required min="18" max="100" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Civil Status *</label>
                <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              <div className="form-group">
                <label>Sex *</label>
                <select name="sex" value={formData.sex} onChange={handleChange} required>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Current Location or Address</label>
              <textarea 
                name="currentLocation" 
                value={formData.currentLocation} 
                onChange={handleChange} 
                rows="2"
                placeholder="Enter your current location/address (if different from permanent address). Leave blank if same as permanent address."
              />
              <small className="form-help">Leave blank if same as permanent address</small>
            </div>

            <div className="form-group">
              <label>Course Graduated *</label>
              <select name="courseGraduated" value={formData.courseGraduated} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="BSIT">Bachelor of Science in Information Technology (BSIT)</option>
                <option value="BSIT Multimedia">Bachelor of Science in Information Technology with specialization in Multimedia Systems</option>
                <option value="BSIT Animation">Bachelor of Science in Information Technology with specialization in Animation & Game Development</option>
              </select>
            </div>

            <div className="form-group">
              <label>School Year Graduated *</label>
              <select name="schoolYearGraduated" value={formData.schoolYearGraduated} onChange={handleChange} required>
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
          </div>

          {/* B. PROFILE EDUCATION */}
          <div className="form-section">
            <h2>B. PROFILE EDUCATION</h2>
            
            <div className="form-group">
              <label>1. Maximum Academic Achievement</label>
              <select name="maxAcademicAchievement" value={formData.maxAcademicAchievement} onChange={handleChange}>
                <option value="">Select or type below...</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate Degree">Doctorate Degree</option>
                <option value="Post-Graduate Diploma">Post-Graduate Diploma</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              <small className="form-help">If your achievement is not listed, you can still type it in the field above after selecting.</small>
            </div>

            <div className="form-group">
              <label>2. Attendance at Training and Seminars over the Last Three Years</label>
              <small className="form-help">If you have no trainings, you can leave the fields blank or click "Remove" to remove the training entry.</small>
              {formData.trainings.map((training, index) => (
                <div key={index} className="training-entry">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title of Training {index === 0 && '(Optional - Leave blank if none)'}</label>
                      <input 
                        type="text" 
                        value={training.title} 
                        onChange={(e) => handleTrainingChange(index, 'title', e.target.value)}
                        placeholder="e.g., Web Development Bootcamp, Data Analytics Seminar (Leave blank if none)"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration & Credits Earned</label>
                      <input 
                        type="text" 
                        value={training.duration} 
                        onChange={(e) => handleTrainingChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 40 hours, 3 units (Leave blank if none)"
                      />
                    </div>
                    <div className="form-group">
                      <label>Name of Trainer/Institution</label>
                      <input 
                        type="text" 
                        value={training.trainer} 
                        onChange={(e) => handleTrainingChange(index, 'trainer', e.target.value)}
                        placeholder="e.g., John Doe or Training Institution Name (Leave blank if none)"
                      />
                    </div>
                    {formData.trainings.length > 1 && (
                      <button type="button" onClick={() => removeTraining(index)} className="btn-remove">Remove</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTraining} className="btn-add-training">+ Add Training</button>
            </div>

            <div className="form-group">
              <label>3. Successful completion of professional exams</label>
              <div className="form-subgroup">
                <label>3.a. Civil Service</label>
                <select name="civilService" value={formData.civilService} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Yes - Professional">Yes - Professional</option>
                  <option value="Yes - Sub Professional">Yes - Sub Professional</option>
                  <option value="No">No - Not yet taken</option>
                  <option value="N/A">N/A - Not Applicable</option>
                </select>
              </div>
              <div className="form-subgroup">
                <label>3.b. LET License</label>
                <select name="letLicense" value={formData.letLicense} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Yes - With License Number">Yes - I have LET License</option>
                  <option value="No">No - Not yet taken</option>
                  <option value="N/A">N/A - Not Applicable</option>
                </select>
                {formData.letLicense === 'Yes - With License Number' && (
                  <input 
                    type="text" 
                    name="letLicenseNumber" 
                    value={formData.letLicenseNumber || ''} 
                    onChange={handleChange} 
                    placeholder="Enter LET License Number (optional)"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>
              <div className="form-subgroup">
                <label>3.c. Other Professional License under PRC</label>
                <select name="otherPRCLicense" value={formData.otherPRCLicense} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Yes - With License Number">Yes - I have PRC License</option>
                  <option value="No">No - None</option>
                  <option value="N/A">N/A - Not Applicable</option>
                </select>
                {formData.otherPRCLicense === 'Yes - With License Number' && (
                  <input 
                    type="text" 
                    name="otherPRCLicenseNumber" 
                    value={formData.otherPRCLicenseNumber || ''} 
                    onChange={handleChange} 
                    placeholder="Enter PRC License Number (optional)"
                    style={{ marginTop: '10px' }}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>4. Involvement in Professional Organizations</label>
              <select name="professionalOrganizations" value={formData.professionalOrganizations} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - Member">Yes - I am a member</option>
                <option value="No">No - Not a member</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {formData.professionalOrganizations === 'Yes - Member' && (
                <textarea 
                  name="professionalOrganizationsList" 
                  value={formData.professionalOrganizationsList || ''} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="List the professional organizations you are involved in (e.g., Philippine Computer Society, etc.)"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          </div>

          {/* C. EMPLOYMENT EXPERIENCES */}
          <div className="form-section">
            <h2>C. EMPLOYMENT EXPERIENCES</h2>
            
            <div className="form-group">
              <label>1. Are you employed? *</label>
              <div className="radio-group">
                <label><input type="radio" name="isEmployed" value="Yes" checked={formData.isEmployed === 'Yes'} onChange={handleChange} required /> Yes</label>
                <label><input type="radio" name="isEmployed" value="No" checked={formData.isEmployed === 'No'} onChange={handleChange} required /> No</label>
              </div>
            </div>

            {formData.isEmployed === 'Yes' && (
              <>
                <div className="form-group">
                  <label>1.a. What is the nature of your current employment? *</label>
                  <select name="employmentNature" value={formData.employmentNature} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option value="Government Sector">Government Sector</option>
                    <option value="Private Sector">Private Sector</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Not Currently Employed">Not Currently Employed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>1.b. What is your current employment classification? *</label>
                  <select name="employmentClassification" value={formData.employmentClassification} onChange={handleChange} required>
                    <option value="">Select...</option>
                    <option value="Regular/Permanent Employee">Regular/Permanent Employee</option>
                    <option value="Probationary">Probationary</option>
                    <option value="Casual/Seasonal">Casual/Seasonal</option>
                    <option value="Contractual">Contractual</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>1.c. What is your current job title or position? *</label>
                  <input 
                    type="text" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    required
                    placeholder="e.g., Software Developer, IT Support Specialist, Web Designer"
                  />
                </div>

                <div className="form-group">
                  <label>1.d. Place of Work *</label>
                  <div className="radio-group">
                    <label><input type="radio" name="placeOfWork" value="Local" checked={formData.placeOfWork === 'Local'} onChange={handleChange} required /> Local</label>
                    <label><input type="radio" name="placeOfWork" value="Abroad" checked={formData.placeOfWork === 'Abroad'} onChange={handleChange} required /> Abroad</label>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>2.a. What is your estimated monthly income? *</label>
              <select name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Less than ₱10,000">Less than ₱10,000</option>
                <option value="₱10,000 – ₱19,999">₱10,000 – ₱19,999</option>
                <option value="₱20,000 – ₱29,999">₱20,000 – ₱29,999</option>
                <option value="₱30,000 and above">₱30,000 and above</option>
              </select>
            </div>

            <div className="form-group">
              <label>3. Additional Revenue Sources</label>
              <select name="additionalRevenueSources" value={formData.additionalRevenueSources} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Yes - Freelance Work">Yes - Freelance Work</option>
                <option value="Yes - Business/Entrepreneurship">Yes - Business/Entrepreneurship</option>
                <option value="Yes - Part-time Job">Yes - Part-time Job</option>
                <option value="Yes - Investments">Yes - Investments</option>
                <option value="No">No - None</option>
                <option value="N/A">N/A - Not Applicable</option>
              </select>
              {(formData.additionalRevenueSources && formData.additionalRevenueSources.startsWith('Yes')) && (
                <textarea 
                  name="additionalRevenueSourcesDetails" 
                  value={formData.additionalRevenueSourcesDetails || ''} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Please specify details about your additional revenue sources (optional)"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>
          </div>

          {/* D. AFTER STUDY STATUS */}
          <div className="form-section">
            <h2>D. AFTER STUDY STATUS</h2>
            <p className="rating-instruction">Please respond based on your agreement to the following statements. Rate from 1 (Disagree) to 5 (Strongly Agree):</p>

            {/* Job Placement */}
            <div className="rating-section">
              <h3>1. Job Placement</h3>
              {[
                { q: 'q1', text: 'My BSIT degree adequately prepared me for the demands of my current job.' },
                { q: 'q2', text: 'The technical skills I learned during my BSIT studies are directly applicable to my current work.' },
                { q: 'q3', text: 'I was able to secure employment in the IT field within a reasonable time after graduation.' },
                { q: 'q4', text: 'The BSIT program provided me with valuable opportunities for internships or on-the-job training that contributed to my job placement.' }
              ].map((item, idx) => (
                <div key={idx} className="rating-question">
                  <label>{item.text}</label>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="rating-label">
                        <input type="radio" name={`jobPlacement_${item.q}`} value={num} 
                          checked={formData.ratings.jobPlacement[item.q] === String(num)} 
                          onChange={(e) => handleRatingChange('jobPlacement', item.q, e.target.value)} />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* IT Field */}
            <div className="rating-section">
              <h3>2. Information Technology Field</h3>
              {[
                { q: 'q1', text: 'The Information Technology field offers many career opportunities for graduates.' },
                { q: 'q2', text: 'Continuous learning and skill development are essential to succeed in the IT industry.' },
                { q: 'q3', text: 'Working in the Information Technology field provides competitive compensation and benefits.' },
                { q: 'q4', text: 'The IT industry plays a vital role in the growth and development of the economy.' }
              ].map((item, idx) => (
                <div key={idx} className="rating-question">
                  <label>{item.text}</label>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="rating-label">
                        <input type="radio" name={`itField_${item.q}`} value={num} 
                          checked={formData.ratings.itField[item.q] === String(num)} 
                          onChange={(e) => handleRatingChange('itField', item.q, e.target.value)} />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Competitive Edge */}
            <div className="rating-section">
              <h3>3. Competitive Edge as a graduate of BSIT Program</h3>
              {[
                { q: 'q1', text: 'My BSIT education has given me a competitive advantage over graduates from other programs.' },
                { q: 'q2', text: 'I feel confident in my ability to solve complex IT problems because of my BSIT training.' },
                { q: 'q3', text: 'The skills I acquired in the BSIT program are in high demand in the job market.' },
                { q: 'q4', text: 'Employers recognize and value the quality of the BSIT program I completed.' }
              ].map((item, idx) => (
                <div key={idx} className="rating-question">
                  <label>{item.text}</label>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="rating-label">
                        <input type="radio" name={`competitiveEdge_${item.q}`} value={num} 
                          checked={formData.ratings.competitiveEdge[item.q] === String(num)} 
                          onChange={(e) => handleRatingChange('competitiveEdge', item.q, e.target.value)} />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Workplace */}
            <div className="rating-section">
              <h3>4. Relationship with Workplace</h3>
              {[
                { q: 'q1', text: 'I feel respected and valued by my colleagues and supervisors at work.' },
                { q: 'q2', text: 'I feel a strong sense of belonging in my workplace.' },
                { q: 'q3', text: 'I am comfortable communicating openly with my team and management.' },
                { q: 'q4', text: 'I receive adequate support from my workplace when I encounter challenges.' }
              ].map((item, idx) => (
                <div key={idx} className="rating-question">
                  <label>{item.text}</label>
                  <div className="rating-buttons">
                    {[1, 2, 3, 4, 5].map(num => (
                      <label key={num} className="rating-label">
                        <input type="radio" name={`workplace_${item.q}`} value={num} 
                          checked={formData.ratings.workplace[item.q] === String(num)} 
                          onChange={(e) => handleRatingChange('workplace', item.q, e.target.value)} />
                        <span>{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E. SCHOOL AND SYSTEM RATINGS */}
          <div className="form-section">
            <h2>E. SCHOOL AND SYSTEM RATINGS</h2>
            
            {/* School Rating */}
            <div className="rating-section">
              <h3>Rate Your School Experience (1-5 Stars)</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <label key={star} className="star-label">
                    <input 
                      type="radio" 
                      name="schoolRating" 
                      value={star}
                      checked={formData.schoolRating === star}
                      onChange={(e) => setFormData(prev => ({ ...prev, schoolRating: parseInt(e.target.value) }))}
                    />
                    <span className="star">★</span>
                  </label>
                ))}
                <span className="rating-value">{formData.schoolRating > 0 ? `${formData.schoolRating} / 5` : 'Not rated'}</span>
              </div>
              <div className="form-group">
                <label>Feedback about the School</label>
                <textarea 
                  name="schoolFeedback" 
                  value={formData.schoolFeedback} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Share your thoughts about your school experience..."
                />
              </div>
            </div>

            {/* System Rating */}
            <div className="rating-section">
              <h3>Rate This System (1-5 Stars)</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <label key={star} className="star-label">
                    <input 
                      type="radio" 
                      name="systemRating" 
                      value={star}
                      checked={formData.systemRating === star}
                      onChange={(e) => setFormData(prev => ({ ...prev, systemRating: parseInt(e.target.value) }))}
                    />
                    <span className="star">★</span>
                  </label>
                ))}
                <span className="rating-value">{formData.systemRating > 0 ? `${formData.systemRating} / 5` : 'Not rated'}</span>
              </div>
              <div className="form-group">
                <label>Feedback about the System</label>
                <textarea 
                  name="systemFeedback" 
                  value={formData.systemFeedback} 
                  onChange={handleChange}
                  rows="4"
                  placeholder="Share your thoughts about this tracer system..."
                />
              </div>
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
