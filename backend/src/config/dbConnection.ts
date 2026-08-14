import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {

    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error('MONGODB_URL environment variable is not defined in backend/src/config/.env');
    }
    await mongoose.connect(mongoUrl);
    logger.info('Database connected successfully!');
  } catch (error) {
    logger.error('DB connection failed:', error);
    process.exit(1);
  }
};

export default connectDB;
