import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SurveyPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function SurveyPage() {
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
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/survey`, formData);
      setSubmitted(true);
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
              <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} required rows="2" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number(s) *</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>E-mail Address *</label>
                <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required />
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
              <textarea name="currentLocation" value={formData.currentLocation} onChange={handleChange} rows="2" />
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
              <input type="text" name="maxAcademicAchievement" value={formData.maxAcademicAchievement} onChange={handleChange} placeholder="e.g., Bachelor's Degree, Master's Degree" />
            </div>

            <div className="form-group">
              <label>2. Attendance at Training and Seminars over the Last Three Years</label>
              {formData.trainings.map((training, index) => (
                <div key={index} className="training-entry">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title of Training</label>
                      <input type="text" value={training.title} onChange={(e) => handleTrainingChange(index, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Duration & Credits Earned</label>
                      <input type="text" value={training.duration} onChange={(e) => handleTrainingChange(index, 'duration', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Name of Trainer</label>
                      <input type="text" value={training.trainer} onChange={(e) => handleTrainingChange(index, 'trainer', e.target.value)} />
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
                  <option value="">None</option>
                  <option value="Professional">Professional</option>
                  <option value="Sub Professional">Sub Professional</option>
                </select>
              </div>
              <div className="form-subgroup">
                <label>3.b. LET License</label>
                <input type="text" name="letLicense" value={formData.letLicense} onChange={handleChange} placeholder="Enter LET License if applicable" />
              </div>
              <div className="form-subgroup">
                <label>3.c. Other Professional License under PRC</label>
                <input type="text" name="otherPRCLicense" value={formData.otherPRCLicense} onChange={handleChange} placeholder="Enter other PRC license" />
              </div>
            </div>

            <div className="form-group">
              <label>4. Involvement in Professional Organizations</label>
              <textarea name="professionalOrganizations" value={formData.professionalOrganizations} onChange={handleChange} rows="3" placeholder="List professional organizations you are involved in" />
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
                  <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
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
              <textarea name="additionalRevenueSources" value={formData.additionalRevenueSources} onChange={handleChange} rows="3" placeholder="Specify additional revenue sources if any" />
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
