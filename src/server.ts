// src/app.ts

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import fileUploadRouter from './routes/fileUpload.routes';
import routes from './routes/index.routes'; // Import all routes from index.routes

// Example error middleware
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// Just a test route
app.get('/test', (req, res) => {
  res.send('Server is live!');
});

// Mount the file upload route at /api/uploads
app.use('/api', routes);
app.use('/api/uploads', fileUploadRouter);

// 404 catch-all (optional)
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
});

// Error handler last
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥🚀 Server running on port ${PORT} 🚀🔥`);
});
