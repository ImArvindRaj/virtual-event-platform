import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/error.middleware.js';
import userRoutes from './api/users/user.routes.js';
import eventRoutes from './api/events/event.routes.js';
import sessionRoutes from './api/sessions/session.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use(errorHandler);

export default app;
