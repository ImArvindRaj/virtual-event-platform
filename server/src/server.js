import 'dotenv/config';
import app from './app.js';
import { connectDB, closeDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
    
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, closing server...');
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    });
    
    process.on('unhandledRejection', async (err) => {
      console.log(`Error: ${err.message}`);
      server.close(async () => {
        await closeDB();
        process.exit(1);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
