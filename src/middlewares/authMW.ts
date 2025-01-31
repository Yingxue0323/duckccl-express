import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { AuthError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import logger from '../utils/logger';
import { config } from '../configs';

// 认证中间件
export const authMiddleware = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    // 1. 从请求头获取 token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.error(`${req.method} ${req.url} - 未提供认证令牌`);
      throw new AuthError('NO_TOKEN', '未提供认证令牌');
    }

    // 2. 验证 token
    const decoded = verifyToken(token);
    
    // 3. 查找用户
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      logger.error(`${req.method} ${req.url} - 用户不存在`);
      throw new AuthError('USER_NOT_FOUND', '用户不存在');
    }

    // 4. 检查用户 session 是否过期
    // if (!user.sessionKey || !user.sessionExpireAt || user.sessionExpireAt < new Date()) {
    //   logger.error(`${req.method} ${req.url} - 会话已过期`);
    //   throw new AuthError('SESSION_EXPIRED', '会话已过期');
    // }

    // 将用户信息附加到请求对象
    req.user = user;
    logger.info(`${req.method} ${req.url} - 认证成功`);
    next();

  } catch (error: any) {
    logger.error(`${req.method} ${req.url} - 认证失败: ${error.message}`);
    if (error instanceof AuthError) {
      return res.status(401).json({
        code: error.code,
        message: error.message
      });
    }
    return res.status(401).json({
      code: 'AUTH_FAILED',
      message: '认证失败'
    });
  }
};

// 管理员权限中间件，ip白名单
export const ipMiddleware = (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (!ip || !config.adminIp.includes(ip as string)) {
      logger.error(`${req.method} ${req.url} - 需要管理员权限`);
      return res.status(403).json({
        success: false,
        message: '需要管理员权限'
      });
    }
    
    next();
  } catch (error: any) {
    logger.error(`${req.method} ${req.url} - 认证失败: ${error.message}`);
    return res.status(401).json({ message: '认证失败' });
  }
};
