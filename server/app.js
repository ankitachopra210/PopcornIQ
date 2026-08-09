import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// A simple test route so we can confirm the server works
app.get('/', (req, res) => {
  res.json({ message: 'PopcornIQ API is running' });
});
app.use('/api/search', searchRoutes);

export default app;