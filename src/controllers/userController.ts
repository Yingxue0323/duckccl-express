import { Request, Response } from 'express';
import logger from '../utils/logger';
import { userService } from '../services/userService';

class UserController {
  // 获取所有用户
  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await userService.getAllUsers();

      logger.info(`获取所有用户成功: ${users.length}`);
      return res.json({ count: users.length, users});
    } catch (error: any) {
      logger.error('获取用户失败:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取用户信息 by id
  async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        logger.error(`用户不存在: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`获取用户信息成功: ${user._id}`);
      return res.json({ success: true, user });

    } catch (error: any) {
      logger.error('获取用户信息失败:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取用户信息 by openid
  async getUserByOpenid(req: Request, res: Response): Promise<any> {
    try {
      const { openid } = req.params;
      const user = await userService.getUserByOpenid(openid);

      if (!user) {
        logger.error(`用户不存在: ${openid}`);
        return res.status(404).json({ message: 'User not found' });
      }

      logger.info(`获取用户信息成功: ${user._id}`);
      return res.json({ success: true, user });
      
    } catch (error: any) {
      logger.error('获取用户信息失败:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  // 更新用户信息
  async updateUserInfo(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const newInfo = req.body;
      const user = await userService.updateUserInfo(id, newInfo);

      logger.info(`更新用户信息成功: ${user._id}`);
      return res.json({ success: true, user });
    } catch (error: any) {
      logger.error('更新用户信息失败:', error);
      return res.status(500).json({ message: error.message });
    }
  }
} 

export const userController = new UserController();