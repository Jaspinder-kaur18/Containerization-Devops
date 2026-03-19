const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT);`);

app.post('/data', async (req, res) => {
  const { name } = req.body;
  const result = await pool.query(
    'INSERT INTO users(name) VALUES($1) RETURNING *',
    [name]
  );
  res.json(result.rows);
});

app.get('/data', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.get('/health', (req, res) => res.send("OK"));

app.listen(3000, () => console.log("Server running"));
