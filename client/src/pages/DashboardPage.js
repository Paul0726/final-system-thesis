import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './DashboardPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      const response = await axios.get(`${API_URL}/surveys`);
      setSurveys(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setLoading(false);
    }
  };

  // Prepare data for charts
  const employmentData = stats ? [
    { name: 'Employed', value: stats.employed || 0 },
    { name: 'Self-Employed', value: stats.selfEmployed || 0 },
    { name: 'Unemployed', value: stats.unemployed || 0 },
    { name: 'Further Studies', value: stats.furtherStudies || 0 }
  ].filter(item => item.value > 0) : [];

  const incomeData = surveys.reduce((acc, survey) => {
    if (survey.monthlyIncome) {
      acc[survey.monthlyIncome] = (acc[survey.monthlyIncome] || 0) + 1;
    }
    return acc;
  }, {});

  const incomeChartData = Object.entries(incomeData).map(([name, value]) => ({
    name: name.replace('₱', 'P'),
    value
  }));

  const courseData = surveys.reduce((acc, survey) => {
    if (survey.courseGraduated) {
      const course = survey.courseGraduated.includes('Multimedia') ? 'BSIT Multimedia' :
                     survey.courseGraduated.includes('Animation') ? 'BSIT Animation' : 'BSIT';
      acc[course] = (acc[course] || 0) + 1;
    }
    return acc;
  }, {});

  const courseChartData = Object.entries(courseData).map(([name, value]) => ({
    name,
    value
  }));

  const yearData = surveys.reduce((acc, survey) => {
    if (survey.schoolYearGraduated) {
      acc[survey.schoolYearGraduated] = (acc[survey.schoolYearGraduated] || 0) + 1;
    }
    return acc;
  }, {});

  const yearChartData = Object.entries(yearData)
    .sort((a, b) => a[0] - b[0])
    .map(([name, value]) => ({
      name,
      value
    }));

  // Calculate average ratings
  const calculateAverageRating = (section) => {
    const ratings = surveys
      .filter(s => s.ratings && s.ratings[section])
      .flatMap(s => Object.values(s.ratings[section]))
      .filter(r => r && !isNaN(parseFloat(r)))
      .map(r => parseFloat(r));
    
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
  };

  const ratingData = [
    { name: 'Job Placement', value: parseFloat(calculateAverageRating('jobPlacement')) },
    { name: 'IT Field', value: parseFloat(calculateAverageRating('itField')) },
    { name: 'Competitive Edge', value: parseFloat(calculateAverageRating('competitiveEdge')) },
    { name: 'Workplace', value: parseFloat(calculateAverageRating('workplace')) }
  ].filter(item => item.value > 0);

  const employmentNatureData = surveys.reduce((acc, survey) => {
    if (survey.employmentNature) {
      acc[survey.employmentNature] = (acc[survey.employmentNature] || 0) + 1;
    }
    return acc;
  }, {});

  const employmentNatureChartData = Object.entries(employmentNatureData).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <Link to="/" className="back-link">← Back to Home</Link>
          <h1>📊 Public Dashboard</h1>
          <p>BSIT Graduate Statistics and Insights</p>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalGraduates || 0}</h3>
                <p>Total Graduates</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-info">
                <h3>{stats.employed || 0}</h3>
                <p>Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>{stats.selfEmployed || 0}</h3>
                <p>Self-Employed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.furtherStudies || 0}</h3>
                <p>Further Studies</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
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
                <BarChart data={incomeChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#10b981" name="Number of Graduates" />
                </BarChart>
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
