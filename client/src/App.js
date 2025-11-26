import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load pages for better performance on low-end devices
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SurveyPage = lazy(() => import('./pages/SurveyPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PersonalDashboard = lazy(() => import('./pages/PersonalDashboard'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TechnicalSupport = lazy(() => import('./pages/TechnicalSupport'));
const EvaluationResultsPage = lazy(() => import('./pages/EvaluationResultsPage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #11823b 0%, #0d6b2f 50%, #0a5524 100%)'
  }}>
    <div style={{ 
      color: 'white', 
      fontSize: '18px',
      textAlign: 'center'
    }}>
      <div style={{ 
        border: '4px solid rgba(255,255,255,0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px'
      }}></div>
      <p>Loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);

function App() {
  // Updated: 2025-11-18 - IT Field feature added
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/personal-dashboard" element={<PersonalDashboard />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/technical-support" element={<TechnicalSupport />} />
            <Route path="/evaluation-results" element={<EvaluationResultsPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
