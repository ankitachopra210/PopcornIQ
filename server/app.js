import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PopcornIQ API is running' });
});

app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);

export default app;