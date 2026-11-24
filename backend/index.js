const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const routesHandler = require('./routes/handler');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));

// Cached MongoDB connection for both local server & Vercel serverless
let cachedConn = null;
async function ensureDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!cachedConn) {
    cachedConn = mongoose.connect(process.env.DB_URI);
  }
  await cachedConn;
  return mongoose.connection;
}

app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection error', error: err.message });
  }
});

app.get(['/api/health', '/health-check'], (req, res) => {
  res.json({
    status: 'ok',
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString(),
  });
});

// Mount under /api (for Vercel production) and / (for local dev)
app.use('/api', routesHandler);
app.use('/', routesHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 1240;
  ensureDB()
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => {
        console.log(`RannaBhai backend running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

module.exports = app;
