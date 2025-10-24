// index.js
const express = require('express');
const db = require('./db');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure users table exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )
`);

// ========== CRUD API ==========

// CREATE
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, email });
  });
});

// READ
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  db.query('UPDATE users SET name=?, email=? WHERE id=?', [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated!' });
  });
});

// DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted!' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
