import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 根据环境选择日志级别
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// 定义日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// 定义日志格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 定义日志输出目标
const transports = [
  // 控制台输出
  new winston.transports.Console(),
  
  // 错误日志文件 - 使用轮转
  new DailyRotateFile({
    filename: path.join('logs', 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',     // 单个文件最大 20MB
    maxFiles: '14d',    // 保留 14 天的日志
    zippedArchive: true // 压缩旧日志
  }),
  
  // 所有日志文件 - 使用轮转
  new DailyRotateFile({
    filename: path.join('logs', 'all-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: true
  })
];

// 创建日志实例
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;