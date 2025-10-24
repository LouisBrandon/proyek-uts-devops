// index.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const path = require('path');

// Create MySQL connection (no DB yet)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
});

// Connect and ensure database + table exist
const DB_NAME = process.env.DB_NAME || 'testdb';
db.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL server');

  // Create database if not exists
  db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, err => {
    if (err) throw err;
    console.log(`🗄️ Database "${DB_NAME}" ready`);

    // Switch to that database
    db.changeUser({ database: DB_NAME }, err => {
      if (err) throw err;
      console.log(`📂 Using database "${DB_NAME}"`);

      // Create table if not exists
      db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100),
          comment VARCHAR(100)
        )
      `, err => {
        if (err) throw err;
        console.log('✅ Table "users" ready');
      });
    });
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CRUD Routes
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  const { name, comment } = req.body;
  db.query('INSERT INTO users (name, comment) VALUES (?, ?)', [name, comment], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User added!', id: result.insertId });
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;
  db.query('UPDATE users SET name=?, comment=? WHERE id=?', [name, comment, id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated!' });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', [id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted!' });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
