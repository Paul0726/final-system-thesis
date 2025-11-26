import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EvaluationResultsPage.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function EvaluationResultsPage() {
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluationStats();
  }, []);

  const fetchEvaluationStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/evaluation-stats`, {
        timeout: 10000
      });
      if (response.data.success) {
        setEvaluationData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching evaluation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Excellent': return '#10b981'; // green
      case 'Very Good': return '#3b82f6'; // blue
      case 'Good': return '#8b5cf6'; // purple
      case 'Fair': return '#f59e0b'; // orange
      case 'Poor': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  if (loading) {
    return (
      <div className="evaluation-results-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading evaluation results...</p>
        </div>
      </div>
    );
  }

  if (!evaluationData) {
    return (
      <div className="evaluation-results-page">
        <div className="error-container">
          <p>No evaluation data available.</p>
          <Link to="/dashboard" className="btn-back">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-results-page">
      <div className="evaluation-container">
        <header className="evaluation-header">
          <Link to="/dashboard" className="back-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back to Dashboard
          </Link>
          <div className="header-title">
            <img src="/seal.png" alt="School Seal" className="header-seal" />
            <div>
              <h1>System Evaluation Results</h1>
              <p>BSIT Graduate Tracer System Performance Evaluation</p>
            </div>
          </div>
        </header>

        <div className="evaluation-content">
          {/* Table 1: Numerical Scale */}
          <div className="evaluation-table-section">
            <h2>Table 1: Numerical Scale</h2>
            <p className="scale-description">
              The respondents were requested to evaluate the BSIT Graduate Tracer System according to criteria of the instrument using numerical scale shown in Table 1. The data were collected to compute the mean rating for each criterion and the overall mean. Results were interpreted in Table 1, for the corresponding descriptive rating.
            </p>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Numerical Range</th>
                  <th>Descriptive Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4.51 - 5.00</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor('Excellent') }}>
                      Excellent
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>3.51 - 4.50</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor('Very Good') }}>
                      Very Good
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>2.51 - 3.50</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor('Good') }}>
                      Good
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>1.51 - 2.50</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor('Fair') }}>
                      Fair
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>1.00 - 1.50</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor('Poor') }}>
                      Poor
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="scale-definitions">
              <h3>Scale Definitions:</h3>
              <ul>
                <li><strong>1 POOR:</strong> System fails to meet basic requirements. Significant functionality problems. Poor user experience. System is difficult or impossible to use.</li>
                <li><strong>2 FAIR:</strong> System partially meets requirements. Several functionality issues exist. Below average user experience. System requires substantial improvements.</li>
                <li><strong>3 GOOD:</strong> System meets most requirements. Minor functionality issues. Acceptable user experience. System is functional and usable.</li>
                <li><strong>4 VERY GOOD:</strong> System meets all requirements. Minimal or no functionality issues. Good user experience. System performs well and is user-friendly.</li>
                <li><strong>5 EXCELLENT:</strong> System exceeds requirements. No functionality issues. Excellent user experience. System is highly functional, intuitive, and efficient.</li>
              </ul>
              <p className="analysis-note">
                The collected ratings were analyzed using descriptive statistics, including mean, frequency distribution, and percentage analysis, to provide a comprehensive assessment of the system's performance.
              </p>
            </div>
          </div>

          {/* Table 2: Functionality */}
          <div className="evaluation-table-section">
            <h2>Table 2: Functionality Performance Scales of the BSIT Graduate Tracer System</h2>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Indicators</th>
                  <th>Mean</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {evaluationData.functionality.indicators.map((indicator, idx) => (
                  <tr key={idx}>
                    <td>{indicator.text}</td>
                    <td>{indicator.mean > 0 ? indicator.mean.toFixed(2) : '-'}</td>
                    <td>
                      <span className="rating-badge" style={{ backgroundColor: getRatingColor(indicator.rating) }}>
                        {indicator.rating}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="overall-row">
                  <td><strong>Overall</strong></td>
                  <td><strong>{evaluationData.functionality.mean > 0 ? evaluationData.functionality.mean.toFixed(2) : '-'}</strong></td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.functionality.rating) }}>
                      <strong>{evaluationData.functionality.rating}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="evaluation-description">
              The respondents rated the system functionality as <strong>{evaluationData.functionality.rating}</strong> with <strong>{evaluationData.functionality.mean > 0 ? evaluationData.functionality.mean.toFixed(2) : 'N/A'}</strong> mean. This indicates that the system was perceived as easy to operate, comfortable, convenient, and user-friendly.
            </p>
          </div>

          {/* Table 3: Reliability */}
          <div className="evaluation-table-section">
            <h2>Table 3: Reliability Performance Scales of the BSIT Graduate Tracer System</h2>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Indicators</th>
                  <th>Mean</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {evaluationData.reliability.indicators.map((indicator, idx) => (
                  <tr key={idx}>
                    <td>{indicator.text}</td>
                    <td>{indicator.mean > 0 ? indicator.mean.toFixed(2) : '-'}</td>
                    <td>
                      <span className="rating-badge" style={{ backgroundColor: getRatingColor(indicator.rating) }}>
                        {indicator.rating}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="overall-row">
                  <td><strong>Overall</strong></td>
                  <td><strong>{evaluationData.reliability.mean > 0 ? evaluationData.reliability.mean.toFixed(2) : '-'}</strong></td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.reliability.rating) }}>
                      <strong>{evaluationData.reliability.rating}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="evaluation-description">
              After calculating the mean, the average score of <strong>{evaluationData.reliability.mean > 0 ? evaluationData.reliability.mean.toFixed(2) : 'N/A'}</strong> was obtained, indicating a <strong>{evaluationData.reliability.rating}</strong> rating. This suggests that the system's performance is highly acceptable, in good condition, and that potential failures can be minimized.
            </p>
          </div>

          {/* Table 4: Accuracy */}
          <div className="evaluation-table-section">
            <h2>Table 4: Accuracy Performance Scales of the BSIT Graduate Tracer System</h2>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Indicators</th>
                  <th>Mean</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {evaluationData.accuracy.indicators.map((indicator, idx) => (
                  <tr key={idx}>
                    <td>{indicator.text}</td>
                    <td>{indicator.mean > 0 ? indicator.mean.toFixed(2) : '-'}</td>
                    <td>
                      <span className="rating-badge" style={{ backgroundColor: getRatingColor(indicator.rating) }}>
                        {indicator.rating}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="overall-row">
                  <td><strong>Overall</strong></td>
                  <td><strong>{evaluationData.accuracy.mean > 0 ? evaluationData.accuracy.mean.toFixed(2) : '-'}</strong></td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.accuracy.rating) }}>
                      <strong>{evaluationData.accuracy.rating}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="evaluation-description">
              With a mean score of <strong>{evaluationData.accuracy.mean > 0 ? evaluationData.accuracy.mean.toFixed(2) : 'N/A'}</strong>, indicating <strong>{evaluationData.accuracy.rating}</strong>, the system's performance is highly accurate. The system was found to be in good condition, with the potential for minimizing failures.
            </p>
          </div>

          {/* Table 5: Efficiency */}
          <div className="evaluation-table-section">
            <h2>Table 5: Efficiency Performance Scales of the BSIT Graduate Tracer System</h2>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Indicators</th>
                  <th>Mean</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {evaluationData.efficiency.indicators.map((indicator, idx) => (
                  <tr key={idx}>
                    <td>{indicator.text}</td>
                    <td>{indicator.mean > 0 ? indicator.mean.toFixed(2) : '-'}</td>
                    <td>
                      <span className="rating-badge" style={{ backgroundColor: getRatingColor(indicator.rating) }}>
                        {indicator.rating}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="overall-row">
                  <td><strong>Overall</strong></td>
                  <td><strong>{evaluationData.efficiency.mean > 0 ? evaluationData.efficiency.mean.toFixed(2) : '-'}</strong></td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.efficiency.rating) }}>
                      <strong>{evaluationData.efficiency.rating}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="evaluation-description">
              The respondents rated the system's efficiency at <strong>{evaluationData.efficiency.mean > 0 ? evaluationData.efficiency.mean.toFixed(2) : 'N/A'}</strong>, indicating <strong>{evaluationData.efficiency.rating}</strong>. This suggests that the system is both useful and user-friendly, with organized record-keeping, easy data entry, and a design that minimizes time and effort for the user.
            </p>
          </div>

          {/* Table 6: Overall Evaluation */}
          <div className="evaluation-table-section">
            <h2>Table 6: Evaluation Result for the Overall Evaluation of the System</h2>
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Mean</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Functionality</td>
                  <td>{evaluationData.functionality.mean > 0 ? evaluationData.functionality.mean.toFixed(2) : '-'}</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.functionality.rating) }}>
                      {evaluationData.functionality.rating}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Reliability</td>
                  <td>{evaluationData.reliability.mean > 0 ? evaluationData.reliability.mean.toFixed(2) : '-'}</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.reliability.rating) }}>
                      {evaluationData.reliability.rating}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Accuracy</td>
                  <td>{evaluationData.accuracy.mean > 0 ? evaluationData.accuracy.mean.toFixed(2) : '-'}</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.accuracy.rating) }}>
                      {evaluationData.accuracy.rating}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Efficiency</td>
                  <td>{evaluationData.efficiency.mean > 0 ? evaluationData.efficiency.mean.toFixed(2) : '-'}</td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.efficiency.rating) }}>
                      {evaluationData.efficiency.rating}
                    </span>
                  </td>
                </tr>
                <tr className="overall-row">
                  <td><strong>MEAN:</strong></td>
                  <td><strong>{evaluationData.overall.mean > 0 ? evaluationData.overall.mean.toFixed(2) : '-'}</strong></td>
                  <td>
                    <span className="rating-badge" style={{ backgroundColor: getRatingColor(evaluationData.overall.rating) }}>
                      <strong>{evaluationData.overall.rating}</strong>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="evaluation-description">
              The overall proposed system's performance is <strong>{evaluationData.overall.rating}</strong> for evaluation with the rating of <strong>{evaluationData.overall.mean > 0 ? evaluationData.overall.mean.toFixed(2) : 'N/A'}</strong>. This means that the proposed BSIT Graduate Tracer System has <strong>{evaluationData.overall.rating}</strong> performance and is useful for both users (BSIT graduates) and administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationResultsPage;

