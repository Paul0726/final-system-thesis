import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StarRating } from '../utils/helpers';
import jsPDF from 'jspdf';
import { useDebounce } from '../utils/debounce';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Layout, 
  Statistic,
  Badge,
  Modal,
  Form,
  Empty,
  Spin,
  Tag,
  Divider,
  Pagination
} from 'antd';
import { 
  SearchOutlined, 
  LogoutOutlined, 
  HomeOutlined,
  MailOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  BellOutlined,
  FileTextOutlined,
  UserOutlined,
  FilterOutlined,
  ReloadOutlined,
  RightOutlined
} from '@ant-design/icons';
import './AdminPage.css';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

const ITEMS_PER_PAGE = 20;

const adminAxios = axios.create({
  baseURL: API_URL
});

adminAxios.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['x-admin-token'] = adminToken;
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const email = 'dwcsjtracersystem@gmail.com';
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('year');
  const [filterGender, setFilterGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSubject, setNotificationSubject] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [selectedYear, setSelectedYear] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchReportsCount = useCallback(async () => {
    try {
      const response = await adminAxios.get('/technical-support/reports/count');
      if (response.data.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching reports count:', error);
    }
  }, []);

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get('/surveys');
      const surveysData = response.data.data || [];
      setSurveys(surveysData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized: Please login again.');
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setOtpSent(false);
        setOtp('');
      } else {
        alert('Error loading surveys. Please check console for details.');
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem('adminToken');
    if (authToken === 'admin-token') {
      setIsAuthenticated(true);
      fetchSurveys();
      fetchReportsCount();
    }
  }, [fetchSurveys, fetchReportsCount]);

  const fetchReports = async () => {
    try {
      setReportsLoading(true);
      const response = await adminAxios.get('/technical-support/reports');
      if (response.data.success) {
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    } finally {
      setReportsLoading(false);
    }
  };

  const markAsRead = async (reportId) => {
    try {
      await adminAxios.put(`/technical-support/reports/${reportId}/read`);
      setReports(reports.map(r => r.id === reportId ? { ...r, is_read: true } : r));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking report as read:', error);
    }
  };

  const deleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await adminAxios.delete(`/technical-support/reports/${reportId}`);
      const wasUnread = reports.find(r => r.id === reportId && !r.is_read);
      setReports(reports.filter(r => r.id !== reportId));
      if (wasUnread) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    }
  };

  const toggleReports = () => {
    if (!showReports) {
      fetchReports();
      fetchReportsCount();
    }
    setShowReports(!showReports);
  };
  
  const fetchNotificationHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await adminAxios.get('/notifications-history');
      if (response.data.success) {
        setNotificationHistory(response.data.history || []);
      }
    } catch (error) {
      console.error('Error fetching notification history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotificationHistory();
    } else {
      setNotificationSubject('');
      setNotificationMessage('');
      setRecipientFilter('all');
      setSelectedYear('');
      setNotificationSuccess(false);
    }
  };
  
  const handleSendNotification = async () => {
    if (!notificationSubject.trim() || !notificationMessage.trim()) {
      alert('Please fill in both subject and message fields.');
      return;
    }
    
    setSendingNotification(true);
    setNotificationSuccess(false);
    
    try {
      const response = await adminAxios.post('/send-notification', {
        subject: notificationSubject,
        message: notificationMessage,
        recipientFilter: recipientFilter,
        selectedYear: selectedYear || null
      });
      
      if (response.data.success) {
        setNotificationSuccess(true);
        setNotificationSubject('');
        setNotificationMessage('');
        setRecipientFilter('all');
        setSelectedYear('');
        fetchNotificationHistory();
        alert(`Notification sent successfully to ${response.data.recipientCount} recipient(s)!`);
      } else {
        alert('Failed to send notification: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      alert(`Error sending notification: ${errorMessage}`);
    } finally {
      setSendingNotification(false);
    }
  };
  
  const availableYears = useMemo(() => {
    const years = new Set();
    surveys.forEach(survey => {
      if (survey.schoolYearGraduated) {
        const year = survey.schoolYearGraduated.split('-')[0] || survey.schoolYearGraduated;
        if (year && year.length === 4) {
          years.add(year);
        }
      }
    });
    return Array.from(years).sort().reverse();
  }, [surveys]);

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

  const handleDelete = async (id) => {
    if (!id) {
      alert('Error: Invalid survey ID');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this survey? This will permanently remove it from the database and all associated user accounts.')) {
      try {
        setLoading(true);
        const response = await adminAxios.delete(`/surveys/${id}`);
        if (response.data.success) {
          await fetchSurveys();
          alert('✅ Survey deleted successfully from database!');
        } else {
          alert(response.data.message || 'Error deleting survey');
        }
      } catch (error) {
        console.error('Error deleting survey:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error deleting survey from database';
        alert(`❌ ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const getLastName = useCallback((name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1] || '';
  }, []);

  const filteredSurveys = useMemo(() => {
    return surveys
      .filter(survey => {
        const matchesSearch = !debouncedSearchTerm || 
          (survey.name && survey.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
          (survey.emailAddress && survey.emailAddress.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        
        let surveyStatus = '';
        if (survey.isEmployed === 'Yes') {
          if (survey.employmentNature === 'Self-Employed') {
            surveyStatus = 'Self-Employed';
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
          const yearA = parseInt(a.schoolYearGraduated) || 0;
          const yearB = parseInt(b.schoolYearGraduated) || 0;
          return yearB - yearA;
        } else if (sortBy === 'name') {
          const lastNameA = getLastName(a.name).toLowerCase();
          const lastNameB = getLastName(b.name).toLowerCase();
          return lastNameA.localeCompare(lastNameB);
        } else if (sortBy === 'gender') {
          const genderA = (a.sex || '').toLowerCase();
          const genderB = (b.sex || '').toLowerCase();
          if (genderA === 'male' && genderB !== 'male') return -1;
          if (genderA !== 'male' && genderB === 'male') return 1;
          return 0;
        }
        return 0;
      });
  }, [surveys, debouncedSearchTerm, filterStatus, filterGender, sortBy, getLastName]);

  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSurveys = useMemo(() => {
    return filteredSurveys.slice(startIndex, endIndex);
  }, [filteredSurveys, startIndex, endIndex]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterStatus, filterGender, sortBy]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Employed': return '#11823b';
      case 'Self-Employed': return '#3b82f6';
      case 'Unemployed': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const generatePDF = (survey) => {
    const doc = new jsPDF();
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    const addText = (text, x, y, maxWidth, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text || 'N/A', maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * (fontSize * 0.4));
    };

    const checkNewPage = (requiredSpace) => {
      if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('BSIT Graduate Tracer System', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Survey Response Details', margin, yPosition);
    yPosition += 15;

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
    yPosition = addText(`IT Field: ${survey.isITField || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Monthly Income: ${survey.monthlyIncome || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition = addText(`Additional Revenue Sources: ${survey.additionalRevenueSources || 'N/A'}`, margin, yPosition, maxWidth, 10);
    yPosition += 5;

    checkNewPage(30);
    
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

    if (survey.systemEvaluation) {
      checkNewPage(30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('E. System Evaluation', margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const evalSections = [
        { key: 'functionality', label: 'Functionality' },
        { key: 'reliability', label: 'Reliability' },
        { key: 'accuracy', label: 'Accuracy' },
        { key: 'efficiency', label: 'Efficiency' }
      ];
      
      evalSections.forEach(section => {
        if (survey.systemEvaluation[section.key]) {
          checkNewPage(15);
          doc.setFont('helvetica', 'bold');
          doc.text(`${section.label}:`, margin, yPosition);
          yPosition += 6;
          doc.setFont('helvetica', 'normal');
          Object.keys(survey.systemEvaluation[section.key]).forEach(key => {
            const value = survey.systemEvaluation[section.key][key];
            if (value) {
              yPosition = addText(`  ${key}: ${value}/5`, margin + 5, yPosition, maxWidth - 5, 9);
            }
          });
          yPosition += 3;
        }
      });
    }

    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - Page ${i} of ${totalPages}`, margin, doc.internal.pageSize.getHeight() - 10);
    }

    const fileName = `Survey_${survey.name?.replace(/[^a-z0-9]/gi, '_') || 'Unknown'}_${survey.schoolYearGraduated || 'Unknown'}.pdf`;
    doc.save(fileName);
  };

  const generateAllPDFs = () => {
    if (filteredSurveys.length === 0) {
      alert('No surveys to export.');
      return;
    }

    if (window.confirm(`Generate PDF for ${filteredSurveys.length} survey(s)? This will download ${filteredSurveys.length} PDF file(s).`)) {
      filteredSurveys.forEach((survey, index) => {
        setTimeout(() => {
          generatePDF(survey);
        }, index * 500);
      });
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const employed = filteredSurveys.filter(s => {
      if (s.isEmployed === 'Yes' && s.employmentNature !== 'Self-Employed') return true;
      return false;
    }).length;
    
    const selfEmployed = filteredSurveys.filter(s => {
      if (s.isEmployed === 'Yes' && s.employmentNature === 'Self-Employed') return true;
      return false;
    }).length;
    
    const unemployed = filteredSurveys.filter(s => {
      if (s.isEmployed === 'No' || s.employmentNature === 'Not Currently Employed') return true;
      return false;
    }).length;
    
    return { employed, selfEmployed, unemployed, total: filteredSurveys.length };
  }, [filteredSurveys]);

  // Login Form
  if (!isAuthenticated) {
    return (
      <Layout className="admin-page">
        <div className="admin-login-container">
          <Card className="admin-login-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={2}>Admin Login</Title>
                <Text type="secondary">Request OTP to access admin panel</Text>
              </div>
              
              {!otpSent ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Text>Click the button below to receive a one-time password (OTP) via email.</Text>
                  <Button 
                    type="primary"
                    size="large"
                    block
                    icon={<MailOutlined />}
                    onClick={handleSendOTP} 
                    loading={loginLoading}
                  >
                    Request OTP
                  </Button>
                </Space>
              ) : (
                <Form onFinish={handleVerifyOTP} layout="vertical">
                  <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '16px' }}>
                    <div style={{ 
                      padding: '12px', 
                      background: '#f6ffed', 
                      border: '1px solid #b7eb8f', 
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />
                      <Text strong>OTP has been sent to your registered email address.</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Please check your inbox and enter the 6-digit code below.
                      </Text>
                    </div>
                  </Space>
                  
                  <Form.Item 
                    label="Enter OTP Code"
                    required
                  >
                    <Input 
                      size="large"
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '18px' }}
                    />
                  </Form.Item>
                  
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Button 
                      type="primary"
                      size="large"
                      block
                      htmlType="submit"
                      icon={<CheckCircleOutlined />}
                      loading={loginLoading}
                    >
                      Verify OTP
                    </Button>
                    <Button 
                      block
                      onClick={() => {
                        setOtpSent(false);
                        setOtp('');
                      }}
                    >
                      ← Request New OTP
                    </Button>
                  </Space>
                </Form>
              )}
              
              <Divider />
              <Link to="/">
                <Button type="link" icon={<HomeOutlined />} block>
                  Back to Home
                </Button>
              </Link>
            </Space>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="admin-page" style={{ minHeight: '100vh' }}>
      <Header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <div className="admin-header-brand">
              <img src="/seal.png" alt="School Seal" className="admin-header-logo" />
              <div className="admin-header-text">
                <Title level={4} className="admin-header-title">Admin Panel</Title>
                <Text className="admin-header-subtitle">Manage BSIT Graduate Survey Data</Text>
              </div>
            </div>
          </div>
          <div className="admin-header-right">
            <Link to="/">
              <Button type="text" icon={<HomeOutlined />} className="admin-header-btn">
                Home
              </Button>
            </Link>
            <Button 
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="admin-header-btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>

      <Content className="admin-content">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Statistics */}
          <Row gutter={[16, 16]} className="admin-stats">
            <Col xs={24} sm={12} md={6}>
              <Card className="admin-stat-card">
                <Statistic
                  title="Total Surveys"
                  value={stats.total}
                  valueStyle={{ color: '#11823b' }}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="admin-stat-card">
                <Statistic
                  title="Employed"
                  value={stats.employed}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="admin-stat-card">
                <Statistic
                  title="Self-Employed"
                  value={stats.selfEmployed}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="admin-stat-card">
                <Statistic
                  title="Unemployed"
                  value={stats.unemployed}
                  valueStyle={{ color: '#faad14' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Search and Filters */}
          <Card className="admin-filters">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Input
                size="large"
                placeholder="Search by name or email..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
              
              <Row gutter={[16, 16]} className="admin-filters-row">
                <Col xs={24} sm={12} md={8} className="admin-filter-item">
                  <Select
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="All Status"
                    value={filterStatus || undefined}
                    onChange={setFilterStatus}
                    suffixIcon={<FilterOutlined />}
                  >
                    <Select.Option value="">All Status</Select.Option>
                    <Select.Option value="Employed">Employed</Select.Option>
                    <Select.Option value="Self-Employed">Self-Employed</Select.Option>
                    <Select.Option value="Unemployed">Unemployed</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8} className="admin-filter-item">
                  <Select
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="All Gender"
                    value={filterGender || undefined}
                    onChange={setFilterGender}
                    suffixIcon={<FilterOutlined />}
                  >
                    <Select.Option value="">All Gender</Select.Option>
                    <Select.Option value="Male">Male</Select.Option>
                    <Select.Option value="Female">Female</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8} className="admin-filter-item">
                  <Select
                    style={{ width: '100%' }}
                    size="large"
                    value={sortBy}
                    onChange={setSortBy}
                  >
                    <Select.Option value="year">Sort by Year (Newest First)</Select.Option>
                    <Select.Option value="name">Sort by Name (Alphabetical)</Select.Option>
                    <Select.Option value="gender">Sort by Gender</Select.Option>
                  </Select>
                </Col>
              </Row>
            </Space>
          </Card>

          {/* Surveys Content */}
          <Card>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>
                  <Text>Loading surveys...</Text>
                </div>
              </div>
            ) : surveys.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="small">
                    <Text strong>No Surveys Yet</Text>
                    <Text type="secondary">There are no survey responses in the database.</Text>
                  </Space>
                }
              >
                <Link to="/survey">
                  <Button type="primary">Go to Survey Page</Button>
                </Link>
              </Empty>
            ) : filteredSurveys.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" size="small">
                    <Text strong>No Results Found</Text>
                    <Text type="secondary">No surveys match your search or filter criteria.</Text>
                  </Space>
                }
              >
                <Button 
                  type="primary"
                  onClick={() => { 
                    setSearchTerm(''); 
                    setFilterStatus(''); 
                    setFilterGender('');
                  }}
                >
                  Clear Filters
                </Button>
              </Empty>
            ) : (
              <>
                <Row gutter={[16, 16]} className="admin-survey-grid">
                  {paginatedSurveys.map((survey, index) => (
                    <Col key={survey.id || index} xs={24} sm={24} md={12} lg={8} xl={6}>
                      <SurveyCard 
                        survey={survey} 
                        index={index} 
                        onDelete={handleDelete} 
                        getStatusColor={getStatusColor}
                        onDownloadPDF={generatePDF}
                      />
                    </Col>
                  ))}
                </Row>
                
                {totalPages > 1 && (
                  <div className="admin-pagination">
                    <Pagination
                      current={currentPage}
                      total={filteredSurveys.length}
                      pageSize={ITEMS_PER_PAGE}
                      onChange={setCurrentPage}
                      showSizeChanger={false}
                      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} surveys`}
                    />
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Admin Actions */}
          <Card>
            <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
              <Button 
                type="primary"
                icon={<BellOutlined />}
                onClick={toggleNotifications}
                size="large"
              >
                Send Notification
              </Button>
              <Badge count={unreadCount} size="small">
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={toggleReports}
                  size="large"
                >
                  Technical Support Reports
                </Button>
              </Badge>
              <Link to="/dashboard">
                <Button size="large">View Dashboard</Button>
              </Link>
              <Button 
                icon={<ReloadOutlined />}
                onClick={fetchSurveys}
                size="large"
              >
                Refresh
              </Button>
              {filteredSurveys.length > 0 && (
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={generateAllPDFs}
                  size="large"
                >
                  Download All as PDF ({filteredSurveys.length})
                </Button>
              )}
            </Space>
          </Card>

          {/* Notification Modal */}
          {showNotifications && (
            <Card 
              title={
                <Space>
                  <BellOutlined />
                  <span>Send Notification to Respondents</span>
                </Space>
              }
              extra={
                <Button type="text" onClick={toggleNotifications}>
                  ×
                </Button>
              }
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {notificationSuccess && (
                  <div style={{ 
                    padding: '12px', 
                    background: '#f6ffed', 
                    border: '1px solid #b7eb8f', 
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />
                    <Text strong>Notification sent successfully!</Text>
                  </div>
                )}
                
                <Form layout="vertical">
                  <Form.Item 
                    label={
                      <span>
                        Subject <Text type="danger">*</Text>
                      </span>
                    }
                  >
                    <Input
                      size="large"
                      value={notificationSubject}
                      onChange={(e) => setNotificationSubject(e.target.value)}
                      placeholder="e.g., Important: Please Complete Additional Survey"
                    />
                  </Form.Item>
                  
                  <Form.Item 
                    label={
                      <span>
                        Message <Text type="danger">*</Text>
                      </span>
                    }
                  >
                    <Input.TextArea
                      rows={8}
                      value={notificationMessage}
                      onChange={(e) => setNotificationMessage(e.target.value)}
                      placeholder="Enter your message here. This will be sent to selected respondents via email."
                    />
                  </Form.Item>
                  
                  <Form.Item 
                    label={
                      <span>
                        Send To <Text type="danger">*</Text>
                      </span>
                    }
                  >
                    <Select
                      size="large"
                      value={recipientFilter}
                      onChange={(value) => {
                        setRecipientFilter(value);
                        if (value !== 'by-year') {
                          setSelectedYear('');
                        }
                      }}
                    >
                      <Select.Option value="all">All Respondents</Select.Option>
                      <Select.Option value="employed">Employed Only</Select.Option>
                      <Select.Option value="unemployed">Unemployed Only</Select.Option>
                      <Select.Option value="self-employed">Self-Employed Only</Select.Option>
                      <Select.Option value="by-year">By Graduation Year</Select.Option>
                    </Select>
                  </Form.Item>
                  
                  {recipientFilter === 'by-year' && (
                    <Form.Item 
                      label={
                        <span>
                          Graduation Year <Text type="danger">*</Text>
                        </span>
                      }
                    >
                      <Select
                        size="large"
                        value={selectedYear}
                        onChange={setSelectedYear}
                        placeholder="Select Year"
                      >
                        {availableYears.map(year => (
                          <Select.Option key={year} value={year}>{year}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                  
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      icon={<BellOutlined />}
                      onClick={handleSendNotification}
                      loading={sendingNotification}
                      disabled={!notificationSubject.trim() || !notificationMessage.trim() || (recipientFilter === 'by-year' && !selectedYear)}
                    >
                      Send Notification
                    </Button>
                    <Button
                      size="large"
                      onClick={toggleNotifications}
                    >
                      Cancel
                    </Button>
                  </Space>
                </Form>
                
                <Divider />
                
                <Card 
                  size="small"
                  title={
                    <Space>
                      <FileTextOutlined />
                      <span>Notification History</span>
                    </Space>
                  }
                  extra={
                    <Button 
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={fetchNotificationHistory}
                      loading={loadingHistory}
                    >
                      Refresh
                    </Button>
                  }
                >
                  {loadingHistory ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Spin />
                      <div style={{ marginTop: '8px' }}>
                        <Text>Loading history...</Text>
                      </div>
                    </div>
                  ) : notificationHistory.length === 0 ? (
                    <Empty description="No notification history yet." />
                  ) : (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {notificationHistory.map((item) => (
                        <Card key={item.id} size="small">
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                              <Title level={5}>{item.subject}</Title>
                              <Space wrap>
                                <Tag>
                                  {item.recipient_filter === 'all' ? 'All Respondents' :
                                   item.recipient_filter === 'employed' ? 'Employed Only' :
                                   item.recipient_filter === 'unemployed' ? 'Unemployed Only' :
                                   item.recipient_filter === 'self-employed' ? 'Self-Employed Only' :
                                   item.recipient_filter === 'by-year' ? `Year: ${item.selected_year || 'N/A'}` :
                                   item.recipient_filter}
                                </Tag>
                                <Text type="secondary">
                                  {item.recipient_count} recipient{item.recipient_count !== 1 ? 's' : ''}
                                </Text>
                                <Text type="secondary">
                                  {new Date(item.sent_at).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Text>
                              </Space>
                            </div>
                            <Text>{item.message}</Text>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  )}
                </Card>
              </Space>
            </Card>
          )}

          {/* Technical Support Reports */}
          {showReports && (
            <Card
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Technical Support Reports</span>
                  {unreadCount > 0 && (
                    <Badge count={unreadCount} />
                  )}
                </Space>
              }
              extra={
                <Button type="text" icon={<ReloadOutlined />} onClick={fetchReports}>
                  Refresh
                </Button>
              }
            >
              {reportsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px' }}>
                    <Text>Loading reports...</Text>
                  </div>
                </div>
              ) : reports.length === 0 ? (
                <Empty description="No reports yet." />
              ) : (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {reports.map((report) => (
                    <Card 
                      key={report.id}
                      size="small"
                      style={{ 
                        borderLeft: !report.is_read ? '4px solid #1890ff' : undefined,
                        background: !report.is_read ? '#f0f9ff' : undefined
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                          <Space wrap>
                            <Tag color={
                              report.priority?.toLowerCase() === 'high' ? 'red' :
                              report.priority?.toLowerCase() === 'medium' ? 'orange' : 'blue'
                            }>
                              {report.priority || 'Medium'}
                            </Tag>
                            <Tag>{report.issue_type}</Tag>
                            {!report.is_read && (
                              <Badge status="processing" text="New" />
                            )}
                          </Space>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(report.created_at).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Text>
                        </div>
                        <Title level={5}>{report.subject}</Title>
                        <Space direction="vertical" size="small">
                          <Text><strong>Reporter:</strong> {report.name}</Text>
                          <Text><strong>Email:</strong> {report.email}</Text>
                        </Space>
                        <Divider style={{ margin: '8px 0' }} />
                        <Text><strong>Description:</strong></Text>
                        <Text>{report.description}</Text>
                        <Space>
                          {!report.is_read && (
                            <Button 
                              size="small"
                              onClick={() => markAsRead(report.id)}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button 
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              Modal.confirm({
                                title: 'Delete Report',
                                content: 'Are you sure you want to delete this report?',
                                okText: 'Yes, Delete',
                                okType: 'danger',
                                cancelText: 'Cancel',
                                onOk: () => deleteReport(report.id),
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Space>
                      </Space>
                    </Card>
                  ))}
                </Space>
              )}
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
}

// Survey Card Component
const SurveyCard = memo(function SurveyCard({ survey, index, onDelete, getStatusColor, onDownloadPDF }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  let surveyStatus = '';
  if (survey.isEmployed === 'Yes') {
    if (survey.employmentNature === 'Self-Employed') {
      surveyStatus = 'Self-Employed';
    } else {
      surveyStatus = 'Employed';
    }
  } else if (survey.isEmployed === 'No' || survey.employmentNature === 'Not Currently Employed') {
    surveyStatus = 'Unemployed';
  }
  
  const getStatusTagColor = (status) => {
    if (status === 'Employed') return 'green';
    if (status === 'Self-Employed') return 'blue';
    if (status === 'Unemployed') return 'orange';
    return 'default';
  };
  
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Modal.confirm({
      title: 'Delete Survey',
      content: `Are you sure you want to delete the survey for ${survey.name}? This action cannot be undone.`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => onDelete(survey.id || index),
    });
  };
  
  return (
    <Card
      className="admin-survey-card"
      hoverable
      onClick={() => setShowDetailsModal(true)}
      actions={[
        <Button
          key="download"
          type="text"
          icon={<DownloadOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadPDF(survey);
          }}
          title="Download as PDF"
        />,
        <Button
          key="delete"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          title="Delete"
        />
      ]}
    >
      <div className="admin-survey-card-content">
        <div className="admin-survey-status-indicator">
          <div className={`admin-survey-status-dot ${surveyStatus === 'Employed' ? 'active' : surveyStatus === 'Self-Employed' ? 'self-employed' : 'inactive'}`}></div>
        </div>
        <div className="admin-survey-main">
          <div className="admin-survey-name">
            {survey.name || 'N/A'}
          </div>
          <div className="admin-survey-secondary">
            <span className="admin-survey-year">
              {survey.schoolYearGraduated || 'N/A'}
            </span>
            <span className="admin-survey-separator">•</span>
            <span className="admin-survey-gender">
              {survey.sex || 'N/A'}
            </span>
            {(survey.isAlumni || survey.interestedAlumni) && (
              <>
                <span className="admin-survey-separator">•</span>
                <span className="admin-survey-alumni">
                  {survey.isAlumni === 'Yes' ? 'Alumni' : survey.interestedAlumni === 'Yes' ? 'Wants Alumni' : ''}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="admin-survey-arrow">
          <RightOutlined />
        </div>
      </div>
      
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UserOutlined style={{ fontSize: '20px', color: '#11823b' }} />
            <span>Respondent Details - {survey.name || 'N/A'}</span>
          </div>
        }
        open={showDetailsModal}
        onCancel={(e) => {
          e.stopPropagation();
          setShowDetailsModal(false);
        }}
        maskClosable={true}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button key="close" onClick={(e) => {
              e.stopPropagation();
              setShowDetailsModal(false);
            }}>
              Close
            </Button>
            <Button 
              key="download" 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadPDF(survey);
                setShowDetailsModal(false);
              }}
            >
              Download PDF
            </Button>
          </div>
        }
        width={isMobile ? '95%' : 1000}
        className="admin-details-modal"
        style={{ top: isMobile ? 10 : 50 }}
        closable={true}
      >
        <div style={{ maxHeight: isMobile ? '75vh' : '70vh', overflowY: 'auto', padding: isMobile ? '4px' : '8px' }}>
          <Row gutter={isMobile ? [12, 12] : [16, 16]}>
            <Col xs={24} sm={12} md={12}>
              <Card size="small" title="Personal Information" className="admin-details-card">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><strong>Name:</strong> {survey.name || 'N/A'}</Text>
                  <Text><strong>Email:</strong> {survey.emailAddress || 'N/A'}</Text>
                  <Text><strong>Mobile:</strong> {survey.mobileNumber || 'N/A'}</Text>
                  <Text><strong>Date of Birth:</strong> {survey.dateOfBirth ? new Date(survey.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</Text>
                  <Text><strong>Age:</strong> {survey.age || 'N/A'}</Text>
                  <Text><strong>Sex:</strong> {survey.sex || 'N/A'}</Text>
                  <Text><strong>Civil Status:</strong> {survey.civilStatus || 'N/A'}</Text>
                  <Text><strong>Permanent Address:</strong> {survey.permanentAddress || 'N/A'}</Text>
                  <Text><strong>Current Location:</strong> {survey.currentLocation || 'N/A'}</Text>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={12}>
              <Card size="small" title="Education" className="admin-details-card">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><strong>Course Graduated:</strong> {survey.courseGraduated || 'N/A'}</Text>
                  <Text><strong>School Year Graduated:</strong> {survey.schoolYearGraduated || 'N/A'}</Text>
                  <Text><strong>Max Academic Achievement:</strong> {survey.maxAcademicAchievement || 'N/A'}</Text>
                  <Text><strong>Civil Service:</strong> {survey.civilService || 'N/A'}</Text>
                  <Text><strong>LET License:</strong> {survey.letLicense || 'N/A'}</Text>
                  <Text><strong>Other PRC License:</strong> {survey.otherPRCLicense || 'N/A'}</Text>
                  <Text><strong>Professional Organizations:</strong> {survey.professionalOrganizations || 'N/A'}</Text>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={12}>
              <Card size="small" title="Employment" className="admin-details-card">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><strong>Is Employed:</strong> {survey.isEmployed || 'N/A'}</Text>
                  <Text><strong>Employment Nature:</strong> {survey.employmentNature || 'N/A'}</Text>
                  <Text><strong>Employment Classification:</strong> {survey.employmentClassification || 'N/A'}</Text>
                  <Text><strong>Job Title:</strong> {survey.jobTitle || 'N/A'}</Text>
                  <Text><strong>Place of Work:</strong> {survey.placeOfWork || 'N/A'}</Text>
                  <Text><strong>IT Field:</strong> {survey.isITField || 'N/A'}</Text>
                  <Text><strong>Monthly Income:</strong> {survey.monthlyIncome || 'N/A'}</Text>
                  <Text><strong>Additional Revenue Sources:</strong> {survey.additionalRevenueSources || 'N/A'}</Text>
                </Space>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} md={12}>
              <Card size="small" title="Alumni & Ratings" className="admin-details-card">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text><strong>Is Alumni:</strong> {survey.isAlumni === 'Yes' ? 'Yes (Alumni)' : survey.isAlumni === 'No' ? 'No (Not Alumni)' : 'N/A'}</Text>
                  {survey.isAlumni !== 'Yes' && (
                    <Text><strong>Interested in Alumni Registration:</strong> {survey.interestedAlumni === 'Yes' ? 'Yes (Wants to Register)' : survey.interestedAlumni === 'No' ? 'No (Not Interested)' : 'N/A'}</Text>
                  )}
                  <Text><strong>School Rating:</strong> {survey.schoolRating ? <><StarRating rating={survey.schoolRating} size="small" /> <span>({survey.schoolRating}/5)</span></> : 'N/A'}</Text>
                  <Text><strong>System Rating:</strong> {survey.systemRating ? <><StarRating rating={survey.systemRating} size="small" /> <span>({survey.systemRating}/5)</span></> : 'N/A'}</Text>
                  <Text><strong>School Feedback:</strong> {survey.schoolFeedback || 'N/A'}</Text>
                  <Text><strong>System Feedback:</strong> {survey.systemFeedback || 'N/A'}</Text>
                </Space>
              </Card>
            </Col>
            
            {survey.systemEvaluation && (
              <Col xs={24} sm={24} md={24}>
                <Card size="small" title="System Evaluation" className="admin-details-card">
                  {survey.systemEvaluation.functionality && (
                    <div style={{ marginBottom: '15px' }}>
                      <Title level={5} style={{ marginBottom: '8px', color: '#11823b' }}>Functionality</Title>
                      <Space direction="vertical" size="small">
                        <Text><strong>The system is easy to use and learned:</strong> {survey.systemEvaluation.functionality.q1 || 'N/A'}/5</Text>
                        <Text><strong>The system can be used with comfort and convenience:</strong> {survey.systemEvaluation.functionality.q2 || 'N/A'}/5</Text>
                        <Text><strong>The system is user-friendly:</strong> {survey.systemEvaluation.functionality.q3 || 'N/A'}/5</Text>
                      </Space>
                    </div>
                  )}
                  
                  {survey.systemEvaluation.reliability && (
                    <div style={{ marginBottom: '15px' }}>
                      <Title level={5} style={{ marginBottom: '8px', color: '#11823b' }}>Reliability</Title>
                      <Space direction="vertical" size="small">
                        <Text><strong>The system provides the correct desired output:</strong> {survey.systemEvaluation.reliability.q1 || 'N/A'}/5</Text>
                        <Text><strong>Absence of failures in the system:</strong> {survey.systemEvaluation.reliability.q2 || 'N/A'}/5</Text>
                        <Text><strong>The system is accurate in performance:</strong> {survey.systemEvaluation.reliability.q3 || 'N/A'}/5</Text>
                      </Space>
                    </div>
                  )}
                  
                  {survey.systemEvaluation.accuracy && (
                    <div style={{ marginBottom: '15px' }}>
                      <Title level={5} style={{ marginBottom: '8px', color: '#11823b' }}>Accuracy</Title>
                      <Space direction="vertical" size="small">
                        <Text><strong>The system gives accurate information/computation:</strong> {survey.systemEvaluation.accuracy.q1 || 'N/A'}/5</Text>
                        <Text><strong>The system provides accurate outputs:</strong> {survey.systemEvaluation.accuracy.q2 || 'N/A'}/5</Text>
                        <Text><strong>The system provides accurate reports:</strong> {survey.systemEvaluation.accuracy.q3 || 'N/A'}/5</Text>
                      </Space>
                    </div>
                  )}
                  
                  {survey.systemEvaluation.efficiency && (
                    <div style={{ marginBottom: '15px' }}>
                      <Title level={5} style={{ marginBottom: '8px', color: '#11823b' }}>Efficiency</Title>
                      <Space direction="vertical" size="small">
                        <Text><strong>The system is well organized and working properly:</strong> {survey.systemEvaluation.efficiency.q1 || 'N/A'}/5</Text>
                        <Text><strong>The system is well organized for purpose:</strong> {survey.systemEvaluation.efficiency.q2 || 'N/A'}/5</Text>
                        <Text><strong>The system is capable to produce the desired output without delaying the run time performance:</strong> {survey.systemEvaluation.efficiency.q3 || 'N/A'}/5</Text>
                      </Space>
                    </div>
                  )}
                </Card>
              </Col>
            )}
            
            {survey.trainings && Array.isArray(survey.trainings) && survey.trainings.length > 0 && (
              <Col xs={24} sm={24} md={24}>
                <Card size="small" title="Trainings" className="admin-details-card">
                  {survey.trainings.map((training, idx) => (
                    <Card key={idx} size="small" style={{ marginBottom: '8px' }}>
                      <Space direction="vertical" size="small">
                        <Text><strong>Title:</strong> {training.title || 'N/A'}</Text>
                        <Text><strong>Duration:</strong> {training.duration || 'N/A'}</Text>
                        <Text><strong>Trainer:</strong> {training.trainer || 'N/A'}</Text>
                      </Space>
                    </Card>
                  ))}
                </Card>
              </Col>
            )}
          </Row>
        </div>
      </Modal>
    </Card>
  );
});

export default AdminPage;
