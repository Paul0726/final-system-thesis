import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function App() {
  const [health, setHealth] = useState(null);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    category: 'General', 
    status: 'Pending' 
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchHealth();
    fetchData();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterCategory, filterStatus]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      setHealth(response.data);
    } catch (error) {
      console.error('Error fetching health:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      
      const response = await axios.get(`${API_URL}/data`, { params });
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/data/${editingId}`, formData);
        showNotification('Item updated successfully!', 'success');
      } else {
        await axios.post(`${API_URL}/data`, formData);
        showNotification('Item added successfully!', 'success');
      }
      setFormData({ title: '', description: '', category: 'General', status: 'Pending' });
      setEditingId(null);
      setShowForm(false);
      fetchData();
      fetchStats();
    } catch (error) {
      console.error('Error submitting data:', error);
      showNotification('Error saving item', 'error');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/data/${id}`);
        showNotification('Item deleted successfully!', 'success');
        fetchData();
        fetchStats();
      } catch (error) {
        console.error('Error deleting data:', error);
        showNotification('Error deleting item', 'error');
      }
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', description: '', category: 'General', status: 'Pending' });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Chapter': return '📚';
      case 'Task': return '✅';
      case 'General': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className="App">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>🎓 Thesis Management System</h1>
            <p>Organize and manage your thesis work efficiently</p>
            {health && (
              <div className="server-status">
                <span className="status-dot"></span>
                <span>Server: {health.status}</span>
              </div>
            )}
          </div>
        </header>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Items</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.byStatus['Completed']}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-info">
                <h3>{stats.byStatus['In Progress']}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.byStatus['Pending']}</h3>
                <p>Pending</p>
              </div>
            </div>
          </div>
        )}

        <div className="controls-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Chapter">📚 Chapter</option>
              <option value="Task">✅ Task</option>
              <option value="General">📝 General</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Completed">✅ Completed</option>
              <option value="In Progress">🔄 In Progress</option>
              <option value="Pending">⏳ Pending</option>
            </select>
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="btn-add"
            >
              {showForm ? '✕ Cancel' : '+ Add New Item'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="form-section">
            <h2>{editingId ? '✏️ Edit Item' : '+ Add New Item'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="form-textarea"
                />
              </div>
              <div className="form-row">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="form-select"
                >
                  <option value="General">📝 General</option>
                  <option value="Chapter">📚 Chapter</option>
                  <option value="Task">✅ Task</option>
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="form-select"
                >
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? '💾 Update Item' : '➕ Add Item'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="btn-cancel">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="data-section">
          <h2>📋 Items ({data.length})</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : data.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No items found. Add a new item to get started!</p>
            </div>
          ) : (
            <div className="data-grid">
              {data.map((item) => (
                <div key={item.id} className="data-card">
                  <div className="card-header">
                    <div className="card-category">
                      <span className="category-icon">{getCategoryIcon(item.category)}</span>
                      <span className="category-text">{item.category}</span>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="card-footer">
                    <span className="card-date">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <div className="card-actions">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="footer">
          <p>🚂 Deployed on Railway | Made with ❤️ for Thesis Management</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
