import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';
import logger from '../utils/logger';

class AuthController {
  // 微信登录
  async wechatLogin(req: Request, res: Response): Promise<any> {
    try {
      const { code } = req.body;
      const { user, token } = await authService.wechatLogin(code);

      logger.info(`微信登录成功: ${user.openId}`);
      return SuccessHandler(res, { user, token });
    } catch (error: any) {
      logger.error(`微信登录失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.WX_LOGIN_FAILED, error.message);
    }
  };

  // 刷新 token
  async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const { code } = req.body;
      const { token } = await authService.refreshToken(code);

      logger.info(`刷新token成功: ${token}`);
      return SuccessHandler(res, { token });
      
    } catch (error: any) {
      logger.error(`刷新token失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.TOKEN_REFRESH_FAILED, error.message);
    }
  }

  // 微信登出
  async wechatLogout(req: Request, res: Response): Promise<any> {
    try {
      const result = await authService.wechatLogout(req.user.openId);

      logger.info(`微信登出成功: ${req.user.openId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`微信登出失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.LOGOUT_FAILED, error.message);
    }
  }
} 

export const authController = new AuthController();