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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Aggressive mobile detection for performance optimization
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isAndroid = /android/i.test(userAgent);
      const isMobileWidth = window.innerWidth < 768;
      const isMobileDevice = isAndroid || isMobileWidth || 
                            /webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Force mobile mode on Android regardless of screen size
      setIsMobile(isAndroid || isMobileDevice);
    };
    
    checkMobile();
    // Throttle resize listener for better performance
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        timeout: 10000 // 10 second timeout for slow connections
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Memoize chart data computations for better performance
  const employmentData = useMemo(() => {
    return stats ? [
    { name: 'Employed', value: stats.employed || 0 },
    { name: 'Self-Employed', value: stats.selfEmployed || 0 },
    { name: 'Unemployed', value: stats.unemployed || 0 }
  ].filter(item => item.value > 0) : [];
  }, [stats]);

  // Use chart data from stats API (no need to fetch individual surveys)
  const incomeChartData = useMemo(() => {
    return stats?.charts?.income || [];
  }, [stats]);

  const courseChartData = useMemo(() => {
    return stats?.charts?.course || [];
  }, [stats]);

  const yearChartData = useMemo(() => {
    return stats?.charts?.year || [];
  }, [stats]);

  const ratingData = useMemo(() => {
    return stats?.charts?.ratings || [];
  }, [stats]);

  const employmentNatureChartData = useMemo(() => {
    return stats?.charts?.employmentNature || [];
  }, [stats]);

  // IT Field Distribution Chart Data
  const itFieldChartData = useMemo(() => {
    return stats?.charts?.itField || [];
  }, [stats]);

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
            <img src="/seal.png" alt="School Seal" className="header-seal" />
            <div className="dashboard-title-wrapper">
              <div className="title-decoration title-decoration-left"></div>
              <h1>Public Dashboard</h1>
              <div className="title-decoration title-decoration-right"></div>
            </div>
            <p>BSIT Graduate Statistics and Insights</p>
          </div>
          <Link to="/evaluation-results" className="evaluation-results-btn">
            View System Evaluation Results
          </Link>
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
            <div className="stat-card stat-card-center">
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
                <h3>{stats.letLicense || 0}</h3>
                <p>LET License</p>
              </div>
            </div>
          </div>
        )}

        <div className="charts-grid">
          {/* Employment Status - Mobile: Simple List, Desktop: Chart */}
          {employmentData.length > 0 && (
            <div className="chart-card">
              <h2>Employment Status Distribution</h2>
              {isMobile ? (
                <div className="mobile-data-list">
                  {employmentData.map((item, index) => {
                    const total = employmentData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = ((item.value / total) * 100).toFixed(0);
                    return (
                      <div key={index} className="data-item">
                        <div className="data-label">
                          <span className="data-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span>{item.name}</span>
                        </div>
                        <div className="data-value">
                          <strong>{item.value}</strong> ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Income Distribution - Mobile: Simple List, Desktop: Chart */}
          {incomeChartData.length > 0 && (
            <div className="chart-card">
              <h2>Monthly Income Distribution</h2>
              {isMobile ? (
                <div className="mobile-data-list">
                  {incomeChartData.map((item, index) => (
                    <div key={index} className="data-item">
                      <div className="data-label">{item.name}</div>
                      <div className="data-value"><strong>{item.value}</strong></div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Course Graduated - Mobile: Simple List, Desktop: Chart */}
          {courseChartData.length > 0 && (
            <div className="chart-card">
              <h2>Course Graduated Distribution</h2>
              {isMobile ? (
                <div className="mobile-data-list">
                  {courseChartData.map((item, index) => (
                    <div key={index} className="data-item">
                      <div className="data-label">{item.name}</div>
                      <div className="data-value"><strong>{item.value}</strong></div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Year Graduated - Mobile: Simple List, Desktop: Chart */}
          {yearChartData.length > 0 && (
            <div className="chart-card">
              <h2>Graduation Year Distribution</h2>
              {isMobile ? (
                <div className="mobile-data-list">
                  {yearChartData.map((item, index) => (
                    <div key={index} className="data-item">
                      <div className="data-label">{item.name}</div>
                      <div className="data-value"><strong>{item.value}</strong></div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Average Ratings - Mobile: Simple List, Desktop: Chart */}
          {ratingData.length > 0 && (
            <div className="chart-card">
              <h2>Average Satisfaction Ratings</h2>
              <p className="chart-subtitle">Scale: 1 (Disagree) to 5 (Strongly Agree)</p>
              {isMobile ? (
                <div className="mobile-data-list">
                  {ratingData.map((item, index) => (
                    <div key={index} className="data-item">
                      <div className="data-label">{item.name}</div>
                      <div className="data-value">
                        <strong>{item.value.toFixed(2)}</strong> / 5.00
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* Employment Nature - Mobile: Simple List, Desktop: Chart */}
          {employmentNatureChartData.length > 0 && (
            <div className="chart-card">
              <h2>Employment Nature Distribution</h2>
              {isMobile ? (
                <div className="mobile-data-list">
                  {employmentNatureChartData.map((item, index) => {
                    const total = employmentNatureChartData.reduce((sum, d) => sum + d.value, 0);
                    const percentage = ((item.value / total) * 100).toFixed(0);
                    return (
                      <div key={index} className="data-item">
                        <div className="data-label">
                          <span className="data-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span>{item.name}</span>
                        </div>
                        <div className="data-value">
                          <strong>{item.value}</strong> ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
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
              )}
            </div>
          )}

          {/* IT Field Distribution - Mobile: Simple List, Desktop: Chart */}
          <div className="chart-card">
            <h2>IT Field Distribution</h2>
            <p className="chart-subtitle">Based on current employment status</p>
            {itFieldChartData.length > 0 ? (
              <>
                {isMobile ? (
                  <div className="mobile-data-list">
                    {itFieldChartData.map((item, index) => {
                      const total = itFieldChartData.reduce((sum, d) => sum + d.value, 0);
                      const percentage = ((item.value / total) * 100).toFixed(0);
                      return (
                        <div key={index} className="data-item">
                          <div className="data-label">
                            <span className="data-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                            <span>{item.name}</span>
                          </div>
                          <div className="data-value">
                            <strong>{item.value}</strong> ({percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={itFieldChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {itFieldChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                <p>No data available yet.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
                  IT Field data will appear here once surveys with employment information are submitted.
                </p>
              </div>
            )}
          </div>
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
