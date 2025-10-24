// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

connection.connect(err => {
  if (err) throw err;
  console.log('✅ Connected to MySQL server!');

  const dbName = process.env.DB_NAME || 'testdb';

  // Drop and recreate the database
  connection.query(`DROP DATABASE IF EXISTS ${dbName}`, err => {
    if (err) throw err;
    console.log(`💣 Dropped database ${dbName}`);

    connection.query(`CREATE DATABASE ${dbName}`, err => {
      if (err) throw err;
      console.log(`🗄️  Recreated database ${dbName}`);
    });
  });
});

module.exports = connection;
