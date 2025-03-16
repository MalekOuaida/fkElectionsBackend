import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

// Example: if you have a PostgreSQL pool and a Mongo config
import pool from './config/db';  // or wherever your PG connection is
import './config/mongo';        // just an example if you have a Mongo config

// Example error middleware
import { errorHandler } from './middlewares/errorMiddleware';

// Example route aggregator
import apiRoutes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// ✅ Quick DB test route, with emojis in the response
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: '✅ PostgreSQL Database Connected 🎉',
      timestamp: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Database connection error 🚨'
    });
  }
});

// ✅ Mount your API routes, e.g. /api/citizens, /api/users, etc.
app.use('/api', apiRoutes);

// ✅ Use your error handler middleware last
app.use(errorHandler);

// ✅ Start the server with a bit of emoji flair
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥🚀 Server running on port ${PORT} 🚀🔥`);
});
