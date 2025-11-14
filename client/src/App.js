import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

function App() {
  const [health, setHealth] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchHealth();
    fetchData();
  }, []);

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
      const response = await axios.get(`${API_URL}/data`);
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/data`, formData);
      alert('Data submitted successfully!');
      setFormData({ title: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🎓 Thesis System</h1>
          <p>Web Application for Thesis Management</p>
        </header>

        {health && (
          <div className="health-card">
            <h2>Server Status</h2>
            <p><strong>Status:</strong> {health.status}</p>
            <p><strong>Message:</strong> {health.message}</p>
            <p><strong>Time:</strong> {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        )}

        <div className="content-section">
          <div className="form-section">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit} className="form">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>

          <div className="data-section">
            <h2>Data List</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="data-list">
                {data.map((item) => (
                  <div key={item.id} className="data-card">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          <p>Deployed on Railway 🚂</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

