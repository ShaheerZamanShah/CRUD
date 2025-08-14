require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
// Support multiple origins separated by comma
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = allowedOrigin.split(',').map(o => o.trim());
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());



let db; // DB connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  database: process.env.DB_NAME || 'crud_db'
};

function initDatabase(callback) {
  db = mysql.createConnection(dbConfig);
  db.connect((err) => {
    if (err) return callback(err);
    const ensureTable = `CREATE TABLE IF NOT EXISTS items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT
    )`;
    db.query(ensureTable, (e) => {
      if (e) return callback(e);
      console.log('Connected to MySQL database');
      callback(null);
    });
  });
}


// Get all items
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  db.query('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, name, description });
  });
});

// Edit item
app.put('/items/:id', (req, res) => {
  const { name, description } = req.body;
  db.query('UPDATE items SET name=?, description=? WHERE id=?', [name, description, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: req.params.id, name, description });
  });
});

// Delete item
app.delete('/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
});

initDatabase((err) => {
  if (err) {
    console.error('Database init failed:', err.message || err);
    process.exit(1);
  }
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => res.json({ ok: true }));
