import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get(`${API_URL}/items`);
    setItems(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/items/${editingId}`, form);
    } else {
      await axios.post(`${API_URL}/items`, form);
    }
    setForm({ name: '', description: '' });
    setEditingId(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
  await axios.delete(`${API_URL}/items/${id}`);
    fetchItems();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>CRUD Items</h1>
        <p>Manage your items with style.</p>
      </header>

      <form onSubmit={handleSubmit} className="card form">
        <div className="row">
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Item name"
            required
          />
          <input
            className="input"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
            required
          />
        </div>
        <div className="row">
          <button className="btn primary" type="submit">{editingId ? 'Update' : 'Add'}</button>
          {editingId && (
            <button className="btn" type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>Cancel</button>
          )}
        </div>
      </form>

      <ul className="list">
        {items.map(item => (
          <li key={item.id} className="card list-item fade-in">
            <div className="item-text">
              <div className="item-title">{item.name}</div>
              <div className="item-desc">{item.description}</div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
              <button className="btn danger" onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
