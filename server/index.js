const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory database (for demo - in production, use real database)
let items = [
  { id: 1, title: 'Chapter 1: Introduction', description: 'Research background and objectives', category: 'Chapter', status: 'Completed', createdAt: new Date().toISOString() },
  { id: 2, title: 'Chapter 2: Literature Review', description: 'Review of related studies and theories', category: 'Chapter', status: 'In Progress', createdAt: new Date().toISOString() },
  { id: 3, title: 'Data Collection', description: 'Gather survey responses and interviews', category: 'Task', status: 'Pending', createdAt: new Date().toISOString() }
];

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

// Get all items
app.get('/api/data', (req, res) => {
  const { search, category, status } = req.query;
  let filteredItems = [...items];

  // Filter by search
  if (search) {
    filteredItems = filteredItems.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by category
  if (category) {
    filteredItems = filteredItems.filter(item => item.category === category);
  }

  // Filter by status
  if (status) {
    filteredItems = filteredItems.filter(item => item.status === status);
  }

  res.json({
    message: 'Data retrieved successfully',
    data: filteredItems,
    total: filteredItems.length
  });
});

// Get single item
app.get('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  
  res.json({ success: true, data: item });
});

// Create new item
app.post('/api/data', (req, res) => {
  const { title, description, category, status } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }

  const newItem = {
    id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
    title,
    description,
    category: category || 'General',
    status: status || 'Pending',
    createdAt: new Date().toISOString()
  };

  items.push(newItem);
  
  res.json({
    success: true,
    message: 'Item created successfully',
    data: newItem
  });
});

// Update item
app.put('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, category, status } = req.body;
  
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    title: title || items[itemIndex].title,
    description: description || items[itemIndex].description,
    category: category || items[itemIndex].category,
    status: status || items[itemIndex].status,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Item updated successfully',
    data: items[itemIndex]
  });
});

// Delete item
app.delete('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const deletedItem = items.splice(itemIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Item deleted successfully',
    data: deletedItem
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    total: items.length,
    byStatus: {
      'Completed': items.filter(i => i.status === 'Completed').length,
      'In Progress': items.filter(i => i.status === 'In Progress').length,
      'Pending': items.filter(i => i.status === 'Pending').length
    },
    byCategory: {
      'Chapter': items.filter(i => i.category === 'Chapter').length,
      'Task': items.filter(i => i.category === 'Task').length,
      'General': items.filter(i => i.category === 'General').length
    }
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

