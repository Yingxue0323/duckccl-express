import mongoose from 'mongoose';
import logger from '../utils/logger';

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    logger.error('错误: 未设置 MONGODB_URI 环境变量');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Atlas 连接成功');
  } catch (error: any) {
    logger.error(`MongoDB Atlas 连接失败: ${JSON.stringify({ error: error.message })}`);
    process.exit(1);
  }
};