import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ledger_db';
const pool = new Pool({
  connectionString,
});

const app = express();
app.use(cors());
app.use(express.json());

// Brokers Endpoints
app.get('/api/brokers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM brokers ORDER BY score DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/brokers', async (req, res) => {
  const { name, years_active, years, score, regulator, license_no, license, country, account_type, type, flags, min_deposit, max_leverage } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO brokers (name, years_active, score, regulator, license_no, country, account_type, flags, min_deposit, max_leverage) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, years_active ?? years, score, regulator, license_no ?? license, country, account_type ?? type, flags, min_deposit || 50, max_leverage || '1:500']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/brokers/:id', async (req, res) => {
  const { flags } = req.body;
  try {
    const { rows } = await pool.query('UPDATE brokers SET flags = $1 WHERE id = $2 RETURNING *', [flags || [], req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brokers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM brokers WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exposure Reports Endpoints
app.get('/api/exposures', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM exposures ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exposures', async (req, res) => {
  const { broker_name, title, details, disputed_amount, reporter_email } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO exposures (broker_name, title, details, disputed_amount, reporter_email, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [broker_name, title, details, disputed_amount || 0, reporter_email || '']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/exposures/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'published', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid exposure status' });
  }
  try {
    const { rows } = await pool.query('UPDATE exposures SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Exposure not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exposures/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM exposures WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Exposure not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// News Endpoints
app.get('/api/news', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM news ORDER BY published_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  const { title, summary, category } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO news (title, summary, category) VALUES ($1, $2, $3) RETURNING *',
      [title, summary, category || 'Regulation']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS brokers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      years_active INTEGER DEFAULT 0,
      score NUMERIC(3, 1) DEFAULT 0,
      regulator TEXT NOT NULL,
      license_no TEXT NOT NULL,
      country TEXT NOT NULL,
      account_type TEXT DEFAULT 'Unknown',
      flags TEXT[] DEFAULT '{}',
      min_deposit NUMERIC DEFAULT 50,
      max_leverage TEXT DEFAULT '1:500'
    );
    CREATE TABLE IF NOT EXISTS exposures (
      id SERIAL PRIMARY KEY,
      broker_name TEXT NOT NULL,
      title TEXT NOT NULL,
      details TEXT NOT NULL,
      disputed_amount NUMERIC DEFAULT 0,
      reporter_email TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS news (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

initializeDatabase()
  .then(() => {
    console.log('Database connected and initialized successfully.');
  })
  .catch((err) => {
    console.warn(`Database connection notice: ${err.message}`);
    console.warn('Server will continue running. (API endpoints requiring PostgreSQL will return errors until database is reachable)');
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`Ledger API operational on port ${PORT}`));
  });