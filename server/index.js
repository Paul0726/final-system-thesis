const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database (for demo - in production, use real database)
let surveys = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Survey Routes
// Get all surveys
app.get('/api/surveys', (req, res) => {
  res.json({
    success: true,
    message: 'Surveys retrieved successfully',
    data: surveys
  });
});

// Get single survey
app.get('/api/surveys/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const survey = surveys.find(s => s.id === id);
  
  if (!survey) {
    return res.status(404).json({ success: false, message: 'Survey not found' });
  }
  
  res.json({ success: true, data: survey });
});

// Create new survey
app.post('/api/survey', (req, res) => {
  const { name, yearGraduated, currentStatus, company, position, email, contactNumber, address, feedback } = req.body;
  
  if (!name || !yearGraduated || !currentStatus || !email) {
    return res.status(400).json({ success: false, message: 'Name, year graduated, status, and email are required' });
  }

  const newSurvey = {
    id: surveys.length > 0 ? Math.max(...surveys.map(s => s.id)) + 1 : 1,
    name,
    yearGraduated,
    currentStatus,
    company: company || '',
    position: position || '',
    email,
    contactNumber: contactNumber || '',
    address: address || '',
    feedback: feedback || '',
    createdAt: new Date().toISOString()
  };

  surveys.push(newSurvey);
  
  res.json({
    success: true,
    message: 'Survey submitted successfully',
    data: newSurvey
  });
});

// Delete survey
app.delete('/api/surveys/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const surveyIndex = surveys.findIndex(s => s.id === id);
  
  if (surveyIndex === -1) {
    return res.status(404).json({ success: false, message: 'Survey not found' });
  }

  const deletedSurvey = surveys.splice(surveyIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Survey deleted successfully',
    data: deletedSurvey
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalGraduates: surveys.length,
    employed: surveys.filter(s => s.currentStatus === 'Employed').length,
    selfEmployed: surveys.filter(s => s.currentStatus === 'Self-Employed').length,
    unemployed: surveys.filter(s => s.currentStatus === 'Unemployed').length,
    furtherStudies: surveys.filter(s => s.currentStatus === 'Further Studies').length
  };

  res.json({ success: true, data: stats });
});

// Catch all handler: send back React's index.html file in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

