import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from root, ledger-client, or client/src
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../client/src/.env') });
dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:1234@localhost:5432/ledger_db';
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

// Supabase REST Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const useSupabase = Boolean(supabaseUrl && supabaseKey);
const supabase = useSupabase ? createClient(supabaseUrl, supabaseKey) : null;

if (useSupabase) {
  console.log(`[DB Config] Connected to Supabase Cloud via SDK: ${supabaseUrl}`);
} else {
  console.log(`[DB Config] Connecting to: ${isLocal ? 'Local PostgreSQL (localhost:5432)' : 'Cloud Database (Postgres URI)'}`);
}

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

// Brokers Endpoints
app.get('/api/brokers', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('brokers').select('*').order('score', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }
    const { rows } = await pool.query('SELECT * FROM brokers ORDER BY score DESC');
    res.json(rows);
  } catch (err) {
    console.error('[GET /api/brokers Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/brokers', async (req, res) => {
  const {
    name, years_active, years, score, regulator, license_no, license, country,
    account_type, type, flags, min_deposit, max_leverage,
    license_status, licenseStatus, trading_env, tradingEnv, field_survey, fieldSurvey,
    user_rating, userRating, sub_scores, subScores, reviews
  } = req.body;

  const resolvedStatus = license_status || licenseStatus || 'Regulated';
  const resolvedEnv = trading_env || tradingEnv || 'AAA';
  const resolvedSurvey = field_survey || fieldSurvey || '';
  const resolvedRating = Number(user_rating ?? userRating ?? 4.5);
  const resolvedSubScores = sub_scores || subScores || { license: 8.0, business: 8.0, risk: 8.0, software: 8.0 };
  const resolvedReviews = Array.isArray(reviews) ? reviews : [];

  try {
    if (useSupabase) {
      const brokerData = {
        name,
        years_active: Number(years_active ?? years ?? 0),
        score: Number(score ?? 0),
        regulator: regulator || 'Unknown',
        license_no: license_no ?? license ?? '—',
        country: country || 'Unknown',
        account_type: account_type ?? type ?? 'ECN',
        flags: Array.isArray(flags) ? flags : [],
        min_deposit: Number(min_deposit || 50),
        max_leverage: String(max_leverage || '1:500'),
        ...(license_status || licenseStatus ? { license_status: resolvedStatus } : {}),
        ...(trading_env || tradingEnv ? { trading_env: resolvedEnv } : {}),
        ...(field_survey || fieldSurvey ? { field_survey: resolvedSurvey } : {}),
        ...(user_rating || userRating ? { user_rating: resolvedRating } : {}),
        ...(sub_scores || subScores ? { sub_scores: resolvedSubScores } : {}),
        ...(reviews ? { reviews: resolvedReviews } : {})
      };
      const { data, error } = await supabase.from('brokers').insert([brokerData]).select();
      if (error) {
        if (error.code === '42501') {
          console.error('[Supabase RLS Blocked] Table "brokers" has Row Level Security enabled.');
          return res.status(403).json({
            error: 'Supabase RLS Error: Row-level security is blocking insert. Run "ALTER TABLE brokers DISABLE ROW LEVEL SECURITY;" in Supabase SQL Editor.',
            code: '42501'
          });
        }
        throw error;
      }
      return res.status(201).json(data[0]);
    }

    const { rows } = await pool.query(
      `INSERT INTO brokers (name, years_active, score, regulator, license_no, country, account_type, flags, min_deposit, max_leverage, license_status, trading_env, field_survey, user_rating, sub_scores, reviews) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [
        name, years_active ?? years ?? 0, score ?? 0, regulator, license_no ?? license ?? '—', country,
        account_type ?? type ?? 'ECN', flags || [], min_deposit || 50, max_leverage || '1:500',
        resolvedStatus, resolvedEnv, resolvedSurvey, resolvedRating,
        JSON.stringify(resolvedSubScores), JSON.stringify(resolvedReviews)
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[POST /api/brokers Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/brokers/:id', async (req, res) => {
  const { flags } = req.body;
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('brokers').update({ flags: flags || [] }).eq('id', req.params.id).select();
      if (error) throw error;
      return res.json(data[0]);
    }
    const { rows } = await pool.query('UPDATE brokers SET flags = $1 WHERE id = $2 RETURNING *', [flags || [], req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brokers/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { error } = await supabase.from('brokers').delete().eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    }
    await pool.query('DELETE FROM brokers WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exposure Reports Endpoints
app.get('/api/exposures', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('exposures').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }
    const { rows } = await pool.query('SELECT * FROM exposures ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/exposures', async (req, res) => {
  const { broker_name, title, details, disputed_amount, reporter_email } = req.body;
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('exposures').insert([{
        broker_name,
        title,
        details,
        disputed_amount: Number(disputed_amount || 0),
        reporter_email: reporter_email || '',
        status: 'pending'
      }]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }
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
    if (useSupabase) {
      const { data, error } = await supabase.from('exposures').update({ status }).eq('id', req.params.id).select();
      if (error) throw error;
      if (!data[0]) return res.status(404).json({ error: 'Exposure not found' });
      return res.json(data[0]);
    }
    const { rows } = await pool.query('UPDATE exposures SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Exposure not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exposures/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { error } = await supabase.from('exposures').delete().eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    }
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
    if (useSupabase) {
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }
    const { rows } = await pool.query('SELECT * FROM news ORDER BY published_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/news', async (req, res) => {
  const { title, summary, category } = req.body;
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('news').insert([{
        title,
        summary,
        category: category || 'Regulation'
      }]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }
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
    if (useSupabase) {
      const { error } = await supabase.from('news').delete().eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    }
    await pool.query('DELETE FROM news WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Field Surveys Endpoints
app.get('/api/field-surveys', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('field_surveys').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }
    const { rows } = await pool.query('SELECT * FROM field_surveys ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/field-surveys', async (req, res) => {
  const { broker, country, address, score, status, findings, date } = req.body;
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('field_surveys').insert([{
        broker,
        country: country || 'Unknown',
        address: address || '',
        score: Number(score ?? 8.0),
        status: status || 'Verified',
        findings: findings || '',
        date: date || new Date().toISOString().slice(0, 10)
      }]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }
    const { rows } = await pool.query(
      `INSERT INTO field_surveys (broker, country, address, score, status, findings, date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [broker, country || 'Unknown', address || '', Number(score ?? 8.0), status || 'Verified', findings || '', date || new Date().toISOString().slice(0, 10)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[POST /api/field-surveys Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/field-surveys/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { error } = await supabase.from('field_surveys').delete().eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    }
    await pool.query('DELETE FROM field_surveys WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Scam Alerts Endpoints
app.get('/api/scam-alerts', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('scam_alerts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    }
    const { rows } = await pool.query('SELECT * FROM scam_alerts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/scam-alerts', async (req, res) => {
  const { broker, country, type, severity, description, date } = req.body;
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('scam_alerts').insert([{
        broker,
        country: country || 'Unknown',
        type: type || 'Clone Fraud',
        severity: severity || 'High',
        description: description || '',
        date: date || new Date().toISOString().slice(0, 10)
      }]).select();
      if (error) throw error;
      return res.status(201).json(data[0]);
    }
    const { rows } = await pool.query(
      `INSERT INTO scam_alerts (broker, country, type, severity, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [broker, country || 'Unknown', type || 'Clone Fraud', severity || 'High', description || '', date || new Date().toISOString().slice(0, 10)]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[POST /api/scam-alerts Error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/scam-alerts/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { error } = await supabase.from('scam_alerts').delete().eq('id', req.params.id);
      if (error) throw error;
      return res.json({ success: true });
    }
    await pool.query('DELETE FROM scam_alerts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

async function initializeDatabase() {
  if (useSupabase) {
    const { error } = await supabase.from('brokers').select('id').limit(1);
    if (error) {
      if (error.code === '42501') {
        console.warn('⚠️ [Supabase Warning] Table "brokers" has Row-Level Security (RLS) enabled.');
        console.warn('   To allow web inserts, run this in Supabase SQL Editor:');
        console.warn('   ALTER TABLE brokers DISABLE ROW LEVEL SECURITY;');
      } else {
        console.warn(`[Supabase Init Notice]: ${error.message}`);
      }
    } else {
      console.log('✅ Supabase connected and verified successfully.');
    }
    return;
  }

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
      max_leverage TEXT DEFAULT '1:500',
      license_status TEXT DEFAULT 'Regulated',
      trading_env TEXT DEFAULT 'AAA',
      field_survey TEXT DEFAULT '',
      user_rating NUMERIC(3, 1) DEFAULT 4.5,
      sub_scores JSONB DEFAULT '{"license": 8.0, "business": 8.0, "risk": 8.0, "software": 8.0}',
      reviews JSONB DEFAULT '[]'
    );
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS license_status TEXT DEFAULT 'Regulated';
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS trading_env TEXT DEFAULT 'AAA';
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS field_survey TEXT DEFAULT '';
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS user_rating NUMERIC(3, 1) DEFAULT 4.5;
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS sub_scores JSONB DEFAULT '{"license": 8.0, "business": 8.0, "risk": 8.0, "software": 8.0}';
    ALTER TABLE brokers ADD COLUMN IF NOT EXISTS reviews JSONB DEFAULT '[]';

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
    CREATE TABLE IF NOT EXISTS scam_alerts (
      id SERIAL PRIMARY KEY,
      broker TEXT NOT NULL,
      country TEXT DEFAULT 'Unknown',
      type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'High',
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS field_surveys (
      id SERIAL PRIMARY KEY,
      broker TEXT NOT NULL,
      country TEXT NOT NULL,
      address TEXT NOT NULL,
      score NUMERIC(3, 1) DEFAULT 8.0,
      status TEXT NOT NULL DEFAULT 'Verified',
      findings TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

// Base API info & Health checks
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    service: 'Broker Ledger API',
    database: useSupabase ? 'Supabase Cloud SDK' : 'PostgreSQL'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: useSupabase ? 'supabase' : 'postgresql',
    time: new Date().toISOString()
  });
});

app.post('/api/seed', async (req, res) => {
  try {
    const seedBrokers = [
      { name: "Solaris Prime", years_active: 16, score: 9.4, regulator: "FCA, ASIC, FSCA", license_no: "UK-771102", country: "United Kingdom", account_type: "ECN", min_deposit: 100, max_leverage: "1:500", flags: [], license_status: "Regulated", trading_env: "AAA", field_survey: "Physical office verified in London.", user_rating: 4.8 },
      { name: "Vantage Global", years_active: 12, score: 9.1, regulator: "ASIC, FCA", license_no: "MM-208841", country: "Australia", account_type: "ECN", min_deposit: 50, max_leverage: "1:500", flags: [], license_status: "Regulated", trading_env: "AA", field_survey: "Verified presence in Sydney.", user_rating: 4.6 },
      { name: "Halcyon Capital", years_active: 9, score: 8.6, regulator: "CySEC", license_no: "CY-118820", country: "Cyprus", account_type: "STP", min_deposit: 200, max_leverage: "1:30", flags: [], license_status: "Regulated", trading_env: "A", field_survey: "Office located in Limassol.", user_rating: 4.2 },
      { name: "Northbridge FX", years_active: 4, score: 5.2, regulator: "Offshore (SVG)", license_no: "SVG-33211", country: "St. Vincent", account_type: "Market Maker", min_deposit: 10, max_leverage: "1:1000", flags: ["Offshore registration"], license_status: "Offshore Regulatory", trading_env: "C", field_survey: "Virtual mailbox only.", user_rating: 2.5 },
      { name: "Copperline Trade", years_active: 2, score: 4.1, regulator: "Offshore (Vanuatu)", license_no: "VU-44092", country: "Vanuatu", account_type: "Market Maker", min_deposit: 20, max_leverage: "1:2000", flags: ["Frequent withdrawal delays"], license_status: "Suspicious", trading_env: "D", field_survey: "Unable to verify physical operations.", user_rating: 1.8 },
      { name: "Reef Markets", years_active: 1, score: 2.8, regulator: "Unregistered", license_no: "—", country: "Unknown", account_type: "Unknown", min_deposit: 250, max_leverage: "1:500", flags: ["No physical registry", "Open dispute cases"], license_status: "Unregulated Clone", trading_env: "F", field_survey: "Entity is a suspected clone.", user_rating: 1.0 }
    ];
    if (useSupabase) {
      const { data: existing } = await supabase.from('brokers').select('id').limit(1);
      if (!existing || existing.length === 0) {
        const { error } = await supabase.from('brokers').insert(seedBrokers);
        if (error) throw error;
        return res.json({ success: true, message: "Seed brokers inserted into Supabase" });
      }
      return res.json({ success: true, message: "Brokers already exist" });
    }
    return res.json({ success: true, message: "Database is configured" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server locally, or export app for serverless platforms like Vercel
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  initializeDatabase()
    .then(() => {
      if (!useSupabase) console.log('Database connected and initialized successfully.');
    })
    .catch((err) => {
      console.warn(`Database connection notice: ${err.message}`);
      console.warn('Server will continue running. (API endpoints requiring PostgreSQL will return errors until database is reachable)');
    })
    .finally(() => {
      app.listen(PORT, () => console.log(`Ledger API operational on port ${PORT}`));
    });
}

export default app;