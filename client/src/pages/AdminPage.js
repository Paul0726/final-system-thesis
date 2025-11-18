import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StarRating } from '../utils/helpers';
import jsPDF from 'jspdf';
import { useDebounce } from '../utils/debounce';
import './AdminPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

// Pagination constants for performance
const ITEMS_PER_PAGE = 20; // Show 20 items per page for better performance

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
  const [currentPage, setCurrentPage] = useState(1);
  
  // Debounce search term for better performance (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

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
    if (window.confirm('Are you sure you want to delete this survey? This will also remove all associated feedbacks from the landing page.')) {
      try {
        const response = await axios.delete(`${API_URL}/surveys/${id}`);
        if (response.data.success) {
          fetchSurveys();
          alert('Survey and associated feedback deleted successfully!');
        } else {
          alert(response.data.message || 'Error deleting survey');
        }
      } catch (error) {
        console.error('Error deleting survey:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error deleting survey';
        alert(errorMessage);
      }
    }
  };

  // Extract last name for sorting (memoized)
  const getLastName = useCallback((name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1] || '';
  }, []);

  // Memoize filtered and sorted surveys for performance
  const filteredSurveys = useMemo(() => {
    return surveys
      .filter(survey => {
        const matchesSearch = !debouncedSearchTerm || 
          (survey.name && survey.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (survey.emailAddress && survey.emailAddress.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        
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
  }, [surveys, debouncedSearchTerm, filterStatus, filterGender, sortBy, getLastName]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSurveys = useMemo(() => {
    return filteredSurveys.slice(startIndex, endIndex);
  }, [filteredSurveys, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterStatus, filterGender, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Employed': return '#11823b';
      case 'Self-Employed': return '#3b82f6';
      case 'Further Studies': return '#8b5cf6';
      case 'Unemployed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Generate PDF for single survey
  const generatePDF = (survey) => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text || 'N/A', maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.4));
    };

    // Helper function to check if new page needed
    const checkNewPage = (requiredSpace) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BSIT Graduate Tracer System', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Survey Response Details', margin, yPosition);
    yPosition += 15;

    // Personal Information Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('A. Personal Information', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Name: ${survey.name || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Email: ${survey.emailAddress || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Mobile Number: ${survey.mobileNumber || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Date of Birth: ${survey.dateOfBirth ? new Date(survey.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Age: ${survey.age || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Sex: ${survey.sex || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Civil Status: ${survey.civilStatus || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Permanent Address: ${survey.permanentAddress || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Current Location: ${survey.currentLocation || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition += 5;

    checkNewPage(30);
    
    // Education Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('B. Education', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Course Graduated: ${survey.courseGraduated || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`School Year Graduated: ${survey.schoolYearGraduated || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Max Academic Achievement: ${survey.maxAcademicAchievement || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Civil Service: ${survey.civilService || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`LET License: ${survey.letLicense || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Other PRC License: ${survey.otherPRCLicense || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Professional Organizations: ${survey.professionalOrganizations || 'N/A'}`, margin, yPosition, maxWidth, 10);
    
    // Trainings
    if (survey.trainings && Array.isArray(survey.trainings) && survey.trainings.length > 0) {
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Trainings Attended:', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      survey.trainings.forEach((training, idx) => {
        checkNewPage(20);
        yPosition = addText(`${idx + 1}. ${training.title || 'N/A'}`, margin + 5, yPosition, maxWidth - 5, 9);
        yPosition = addText(`   Duration: ${training.duration || 'N/A'}`, margin + 5, yPosition, maxWidth - 5, 9);
        yPosition = addText(`   Trainer: ${training.trainer || 'N/A'}`, margin + 5, yPosition, maxWidth - 5, 9);
        yPosition += 3;
      });
    }
    yPosition += 5;

    checkNewPage(30);
    
    // Employment Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('C. Employment', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Is Employed: ${survey.isEmployed || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Employment Nature: ${survey.employmentNature || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Employment Classification: ${survey.employmentClassification || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Job Title: ${survey.jobTitle || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Place of Work: ${survey.placeOfWork || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Monthly Income: ${survey.monthlyIncome || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Additional Revenue Sources: ${survey.additionalRevenueSources || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition += 5;

    checkNewPage(30);
    
    // Ratings Section
    if (survey.ratings) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('D. After Study Status - Ratings', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const ratingSections = [
        { key: 'jobPlacement', label: 'Job Placement' },
        { key: 'itField', label: 'IT Field Competency' },
        { key: 'competitiveEdge', label: 'Competitive Edge' },
        { key: 'workplace', label: 'Workplace Environment' }
      ];
      
      ratingSections.forEach(section => {
        if (survey.ratings[section.key]) {
          checkNewPage(15);
          doc.setFont('helvetica', 'bold');
          doc.text(`${section.label}:`, margin, yPosition);
          yPosition += 6;
          doc.setFont('helvetica', 'normal');
          Object.keys(survey.ratings[section.key]).forEach(key => {
            const value = survey.ratings[section.key][key];
            if (value) {
              yPosition = addText(`  ${key}: ${value}/5`, margin + 5, yPosition, maxWidth - 5, 9);
            }
          });
          yPosition += 3;
        }
      });
      yPosition += 5;
    }

    checkNewPage(30);
    
    // Alumni & Feedback Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('E. Alumni Status & Feedback', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Is Alumni: ${survey.isAlumni === 'Yes' ? 'Yes (Alumni)' : survey.isAlumni === 'No' ? 'No (Not Alumni)' : 'N/A'}`, margin, yPosition, maxWidth, 10);
    if (survey.isAlumni !== 'Yes') {
      yPosition = addText(`Interested in Alumni Registration: ${survey.interestedAlumni === 'Yes' ? 'Yes (Wants to Register)' : survey.interestedAlumni === 'No' ? 'No (Not Interested)' : 'N/A'}`, margin, yPosition, maxWidth, 10);
    }
    yPosition = addText(`School Rating: ${survey.schoolRating ? `${survey.schoolRating}/5` : 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`System Rating: ${survey.systemRating ? `${survey.systemRating}/5` : 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition += 5;
    
    if (survey.schoolFeedback) {
      checkNewPage(20);
      doc.setFont('helvetica', 'bold');
      doc.text('School Feedback:', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      yPosition = addText(survey.schoolFeedback, margin, yPosition, maxWidth, 10);
      yPosition += 5;
    }
    
    if (survey.systemFeedback) {
      checkNewPage(20);
      doc.setFont('helvetica', 'bold');
      doc.text('System Feedback:', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      yPosition = addText(survey.systemFeedback, margin, yPosition, maxWidth, 10);
    }

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - Page ${i} of ${totalPages}`, margin, doc.internal.pageSize.getHeight() - 10);
    }

    // Save PDF
    const fileName = `Survey_${survey.name?.replace(/[^a-z0-9]/gi, '_') || 'Unknown'}_${survey.schoolYearGraduated || 'Unknown'}.pdf`;
    doc.save(fileName);
  };

  // Generate PDF for all filtered surveys
  const generateAllPDFs = () => {
    if (filteredSurveys.length === 0) {
      alert('No surveys to export.');
      return;
    }

    if (window.confirm(`Generate PDF for ${filteredSurveys.length} survey(s)? This will download ${filteredSurveys.length} PDF file(s).`)) {
      filteredSurveys.forEach((survey, index) => {
        setTimeout(() => {
          generatePDF(survey);
        }, index * 500); // Delay each download by 500ms to avoid browser blocking
      });
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
                    {loginLoading ? 'Sending OTP...' : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Request OTP
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOTP} className="login-form">
                  <div className="otp-sent-message">
                    <p>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      OTP has been sent to your registered email address.
                    </p>
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
                    {loginLoading ? 'Verifying...' : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Verify OTP
                      </>
                    )}
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
            <Link to="/" className="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back to Home
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
          <div className="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32" style={{ marginRight: '12px', verticalAlign: 'middle' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="9" y1="9" x2="21" y2="9"></line>
            </svg>
            <div>
              <h1>Admin Panel</h1>
              <p>Manage BSIT Graduate Survey Data</p>
            </div>
          </div>
        </header>

        <div className="admin-controls">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
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
            <>
              <div className="surveys-list">
                {paginatedSurveys.map((survey, index) => (
                  <SurveyCard 
                    key={survey.id || index} 
                    survey={survey} 
                    index={index} 
                    onDelete={handleDelete} 
                    getStatusColor={getStatusColor}
                    onDownloadPDF={generatePDF}
                  />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '30px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #11823b',
                      background: currentPage === 1 ? '#f0f0f0' : 'white',
                      color: currentPage === 1 ? '#999' : '#11823b',
                      borderRadius: '8px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Previous
                  </button>
                  
                  <span style={{ 
                    padding: '8px 16px',
                    color: '#11823b',
                    fontWeight: '500'
                  }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #11823b',
                      background: currentPage === totalPages ? '#f0f0f0' : 'white',
                      color: currentPage === totalPages ? '#999' : '#11823b',
                      borderRadius: '8px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="admin-actions">
          <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
          <button onClick={fetchSurveys} className="btn-refresh">🔄 Refresh</button>
          {filteredSurveys.length > 0 && (
            <button onClick={generateAllPDFs} className="btn-download-all" title="Download all filtered surveys as PDF">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download All as PDF ({filteredSurveys.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Survey Card Component (Memoized for performance)
const SurveyCard = memo(function SurveyCard({ survey, index, onDelete, getStatusColor, onDownloadPDF }) {
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
                onDownloadPDF(survey);
              }}
              className="btn-download"
              title="Download as PDF"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
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
            <span className="expand-icon">
              {expanded ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </span>
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
});

export default AdminPage;

 