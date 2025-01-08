import express, { Express } from 'express';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';
import logger from '../config/logger';
import { loggerMiddleware } from './middleware/loggerMiddleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(loggerMiddleware);

// 数据库连接
connectDB();

// 日志
app.get('/', (req, res) => {
    logger.info('访问了首页路由');
    res.send('Hello World!');
});
// 错误处理示例
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`错误: ${err.message}`);
    res.status(500).send('服务器错误');
});

app.listen(port, () => {
  logger.info(`服务器运行在端口 ${port}`);
});
