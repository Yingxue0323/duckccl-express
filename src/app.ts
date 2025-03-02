import express from 'express';
import { Express, Request, Response} from 'express';
import { connectDB } from './configs/db';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { registerRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 静态文件服务
app.use(express.static('src/public'));

// 数据库连接
connectDB();

// 注册路由
registerRoutes(app);

// 错误处理中间件
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`服务器运行在端口 ${port}`);
});

export default app;