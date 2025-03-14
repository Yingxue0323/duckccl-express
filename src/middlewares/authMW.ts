import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { userService } from '../services/userService';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';
import logger from '../utils/logger';
import { config } from '../configs/index';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt';

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      targetUserId?: string;  // 添加目标用户ID
      isAdmin: boolean;      // 是否管理员
      isUserVIP: boolean;    // 是否用户VIP
    }
  }
}

// 认证中间件
export const authMiddleware = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  // 1. 从请求头获取 token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    logger.error(`${req.method} ${req.url} - 未提供认证令牌`);
    return ErrorHandler(res, ResponseCode.NO_TOKEN);
  }

  // 2. 验证 token
  let decoded;
  try {
    const isValid = await verifyToken(token);
    if (!isValid) {
      logger.error(`${req.method} ${req.url} - authMW: 认证失败: 无效的token`);
      return ErrorHandler(res, ResponseCode.TOKEN_INVALID);
    }
    decoded = jwt.verify(token, config.jwt.secret) as { openId: string };
  } catch (error: any) {
    logger.error(`${req.method} ${req.url} - authMW: 认证失败: ${error.message}`);
    return ErrorHandler(res, ResponseCode.TOKEN_INVALID, error.message);
  }
    
  // 3. 查找用户
  const user = await userService.getUserByOpenid(decoded.openId);
  if (!user) {
    logger.error(`${req.method} ${req.url} - authMW: 用户不存在`);
    return ErrorHandler(res, ResponseCode.USER_NOT_FOUND);
  }

  // 将用户信息附加到请求对象
  try {
    req.user = user;
    const isUserVIP = await userService.checkVIPStatus(user.openId);
    req.isUserVIP = isUserVIP;
    logger.info(`${req.method} ${req.url} - authMW: 认证成功`);
    next();
  } catch (error: any) {
    logger.error(`${req.method} ${req.url} - authMW: 认证失败: ${error.message}`);
    return ErrorHandler(res, ResponseCode.TOKEN_INVALID, error.message);
  }
};

// 管理员权限
export const adminMiddleware = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  // try {
  //   const adminKey = req.headers['x-admin-key'];
  //   const targetUserId = req.headers['x-target-user'] as string;  // 从header中获取目标用户ID
    
  //   if (adminKey !== config.adminSecretKey) {
  //     logger.error(`${req.method} ${req.url} - adminMW: 无管理员权限`);
  //     throw new AuthError('NO_ADMIN_PERMISSION', 'adminMW:无管理员权限');
  //   }

  //   req.isAdmin = true;
  //   if (targetUserId) {
  //     req.targetUserId = targetUserId;
  //     logger.info(`管理员正在操作用户(${targetUserId})信息`);
  //   }

  //   next();
  // } catch (error: any) {
  //   logger.error(`${req.method} ${req.url} - adminMW: ß认证失败: ${error.message}`);
  //   if (error instanceof AuthError) {
  //     return res.status(401).json({
  //       code: error.code,
  //       message: error.message
  //     });
  //   }
  // }
};
