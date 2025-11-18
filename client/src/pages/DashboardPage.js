import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './DashboardPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

const COLORS = ['#11823b', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSurveys();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${API_URL}/surveys`);
      setSurveys(response.data.data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  // Memoize chart data computations for better performance
  const employmentData = useMemo(() => {
    return stats ? [
      { name: 'Employed', value: stats.employed || 0 },
      { name: 'Self-Employed', value: stats.selfEmployed || 0 },
      { name: 'Unemployed', value: stats.unemployed || 0 },
      { name: 'Further Studies', value: stats.furtherStudies || 0 }
    ].filter(item => item.value > 0) : [];
  }, [stats]);

  // Function to extract numeric value from income range for sorting
  const getIncomeSortValue = (incomeRange) => {
    if (!incomeRange) return 0;
    if (incomeRange.includes('Less than')) return 0;
    if (incomeRange.includes('and above')) {
      const match = incomeRange.match(/₱([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, '')) : 999999;
    }
    const match = incomeRange.match(/₱([\d,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const incomeChartData = useMemo(() => {
    const incomeData = surveys.reduce((acc, survey) => {
      if (survey.monthlyIncome) {
        acc[survey.monthlyIncome] = (acc[survey.monthlyIncome] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(incomeData)
      .sort((a, b) => getIncomeSortValue(a[0]) - getIncomeSortValue(b[0]))
      .map(([name, value]) => ({
        name: name.replace('₱', 'P'),
        value
      }));
  }, [surveys]);

  const courseChartData = useMemo(() => {
    const courseData = surveys.reduce((acc, survey) => {
      if (survey.courseGraduated) {
        const course = survey.courseGraduated.includes('Multimedia') ? 'BSIT Multimedia' :
                       survey.courseGraduated.includes('Animation') ? 'BSIT Animation' : 
                       survey.courseGraduated.includes('BSIT') ? 'BSIT' : survey.courseGraduated;
        acc[course] = (acc[course] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(courseData).map(([name, value]) => ({
      name,
      value
    }));
  }, [surveys]);

  const yearChartData = useMemo(() => {
    const yearData = surveys.reduce((acc, survey) => {
      if (survey.schoolYearGraduated) {
        acc[survey.schoolYearGraduated] = (acc[survey.schoolYearGraduated] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(yearData)
      .sort((a, b) => a[0] - b[0])
      .map(([name, value]) => ({
        name,
        value
      }));
  }, [surveys]);

  // Calculate average ratings (memoized)
  const calculateAverageRating = useMemo(() => {
    return (section) => {
      const ratings = surveys
        .filter(s => s.ratings && s.ratings[section])
        .flatMap(s => Object.values(s.ratings[section]))
        .filter(r => r && !isNaN(parseFloat(r)))
        .map(r => parseFloat(r));
      
      if (ratings.length === 0) return 0;
      return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };
  }, [surveys]);

  const ratingData = useMemo(() => {
    return [
      { name: 'Job Placement', value: parseFloat(calculateAverageRating('jobPlacement')) },
      { name: 'IT Field', value: parseFloat(calculateAverageRating('itField')) },
      { name: 'Competitive Edge', value: parseFloat(calculateAverageRating('competitiveEdge')) },
      { name: 'Workplace', value: parseFloat(calculateAverageRating('workplace')) }
    ].filter(item => item.value > 0);
  }, [calculateAverageRating]);

  const employmentNatureChartData = useMemo(() => {
    const employmentNatureData = surveys.reduce((acc, survey) => {
      if (survey.employmentNature) {
        acc[survey.employmentNature] = (acc[survey.employmentNature] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(employmentNatureData).map(([name, value]) => ({
      name,
      value
    }));
  }, [surveys]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <Link to="/" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Home
          </Link>
          <div className="header-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <div>
              <h1>Public Dashboard</h1>
              <p>BSIT Graduate Statistics and Insights</p>
            </div>
          </div>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.totalGraduates || 0}</h3>
                <p>Total Graduates</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.employed || 0}</h3>
                <p>Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.selfEmployed || 0}</h3>
                <p>Self-Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.furtherStudies || 0}</h3>
                <p>Further Studies</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="stat-info">
                <h3>{stats.unemployed || 0}</h3>
                <p>Unemployed</p>
              </div>
            </div>
          </div>
        )}

        <div className="charts-grid">
          {/* Employment Status Pie Chart */}
          {employmentData.length > 0 && (
            <div className="chart-card">
              <h2>Employment Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={employmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Income Distribution */}
          {incomeChartData.length > 0 && (
            <div className="chart-card">
              <h2>Monthly Income Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={incomeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#11823b" strokeWidth={2} name="Number of Graduates" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Course Graduated */}
          {courseChartData.length > 0 && (
            <div className="chart-card">
              <h2>Course Graduated Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" name="Number of Graduates" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Year Graduated */}
          {yearChartData.length > 0 && (
            <div className="chart-card">
              <h2>Graduation Year Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yearChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} name="Number of Graduates" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Average Ratings */}
          {ratingData.length > 0 && (
            <div className="chart-card">
              <h2>Average Satisfaction Ratings</h2>
              <p className="chart-subtitle">Scale: 1 (Disagree) to 5 (Strongly Agree)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#f59e0b" name="Average Rating" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Employment Nature */}
          {employmentNatureChartData.length > 0 && (
            <div className="chart-card">
              <h2>Employment Nature Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={employmentNatureChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {employmentNatureChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="dashboard-actions">
          <Link to="/survey" className="btn-primary">Take Survey</Link>
          <Link to="/admin" className="btn-secondary">Admin Panel</Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
