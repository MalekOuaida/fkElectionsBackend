import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

import fileUploadRouter from './routes/fileUpload.routes';
import routes from './routes/index.routes';

import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/test', (req, res) => {
  res.send('Server is live!');
});


app.use('/api', routes);
app.use('/api/uploads', fileUploadRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🔥🚀 Server running on port ${PORT} 🚀🔥`);
});
