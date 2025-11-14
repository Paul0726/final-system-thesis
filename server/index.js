const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Welcome to Thesis System API',
    data: [
      { id: 1, title: 'Sample Item 1', description: 'This is a sample item' },
      { id: 2, title: 'Sample Item 2', description: 'Another sample item' },
      { id: 3, title: 'Sample Item 3', description: 'Yet another sample item' }
    ]
  });
});

app.post('/api/data', (req, res) => {
  const { title, description } = req.body;
  res.json({
    success: true,
    message: 'Data received successfully',
    data: {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toISOString()
    }
  });
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

