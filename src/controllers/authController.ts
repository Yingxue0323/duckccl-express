import { Request, Response } from 'express';
import { authService } from '../services/authService';
import logger from '../utils/logger';

class AuthController {
  // 微信登录
  async wechatLogin(req: Request, res: Response): Promise<any> {
    try {
      const { code } = req.body;
      const { user, token } = await authService.wechatLogin(code);

      logger.info(`登录成功: ${user._id} ${token}`);
      return res.json({ user, token });

    } catch (error: any) {
      logger.error(`登录失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'WX_LOGIN_FAILED',
        message: error.message 
      });
    }
  };

  // 刷新 token
  async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const { code } = req.body;
      const { token } = await authService.refreshToken(code);

      logger.info(`刷新token成功: ${token}`);
      return res.json({ token });
      
    } catch (error: any) {
      logger.error(`刷新token失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({
        code: 'REFRESH_FAILED',
        message: error.message
      });
    }
  }

  // 微信登出
  async wechatLogout(req: Request, res: Response): Promise<any> {
    try {
      const result = await authService.wechatLogout(req.user._id.toString());
    
      logger.info(`登出成功: ${result.success}`);
      return res.json({ success: result.success });

    } catch (error: any) {

      logger.error(`登出失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({
        code: 'LOGOUT_FAILED',
        message: error.message
      });
    }
  }
} 

export const authController = new AuthController();