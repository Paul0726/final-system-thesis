import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SurveyPage from './pages/SurveyPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PersonalDashboard from './pages/PersonalDashboard';
import UserLogin from './pages/UserLogin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/personal-dashboard" element={<PersonalDashboard />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
