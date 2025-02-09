import { Request, Response } from 'express';
import logger from '../utils/logger';
import { userService } from '../services/userService';

class UserController {
  /**
   * 获取所有用户
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回所有用户列表
   */
  async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await userService.getAllUsers();

      logger.info(`获取所有用户成功: ${users.length}`);
      return res.json({ count: users.length, users});
    } catch (error: any) {
      logger.error(`获取用户失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * 获取用户信息 by id
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回该id的用户信息
   */
  async getUserById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      logger.info(`获取用户信息成功: ${user._id}`);
      return res.json(user);

    } catch (error: any) {
      logger.error(`获取用户信息失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * 获取用户信息 by openid
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回该openid的用户信息
   */
  async getUserByOpenid(req: Request, res: Response): Promise<any> {
    try {
      const { openid } = req.params;
      const user = await userService.getUserByOpenid(openid);

      logger.info(`获取用户信息成功: ${user._id}`);
      return res.json(user);
    } catch (error: any) {
      logger.error(`获取用户信息失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * 更新用户信息
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的用户信息
   */
  async updateUser(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const newInfo = req.body;
      const user = await userService.updateUser(id, newInfo);

      logger.info(`更新用户信息成功: ${id}`);
      return res.json(user);
    } catch (error: any) {
      logger.error(`更新用户信息失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * 删除用户
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回成功与否的boolean
   */
  async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      logger.info(`删除用户成功: ${id}`); 
      return res.json(result);
    } catch (error: any) {
      logger.error(`删除用户失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }
} 

export const userController = new UserController();