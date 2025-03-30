import { Request, Response } from 'express';
import logger from '../utils/logger';
import { userService } from '../services/userService';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';
import { ParamError } from '../utils/errors';

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
      return SuccessHandler(res, { count: users.length, users });
    } catch (error: any) {
      logger.error(`获取用户失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_ALL_USERS_FAILED, error.message);
    }
  }

  /**
   * 获取用户信息
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回该openid的用户信息
   */
  async getUserProfile(req: Request, res: Response): Promise<any> {
    try {
      const openId = req.user.openId;
      const user = await userService.getUserByOpenid(openId);

      logger.info(`获取用户信息成功: ${user.openId}`);
      return SuccessHandler(res, { user });
    } catch (error: any) {
      logger.error(`获取用户信息失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_USER_PROFILE_FAILED, error.message);
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

      logger.info(`获取用户信息成功: ${id}`);
      return SuccessHandler(res, { user });

    } catch (error: any) {
      logger.error(`获取用户信息失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_USER_BY_ID_FAILED, error.message);
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

      logger.info(`获取用户信息成功: ${user.openId}`);
      return SuccessHandler(res, { user });
    } catch (error: any) {
      logger.error(`获取用户信息失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_USER_BY_OPENID_FAILED, error.message);
    }
  }

  /**
   * 更新用户信息
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的用户信息
   */
  async updateUserByOpenid(req: Request, res: Response): Promise<any> {
    try {
      const { openid } = req.params;
      const newInfo = req.body;
      const user = await userService.updateUserByOpenid(openid, newInfo);

      logger.info(`更新用户信息成功: ${openid}`);
      return SuccessHandler(res, { user });
    } catch (error: any) {
      logger.error(`更新用户信息失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.UPDATE_USER_FAILED, error.message);
    }
  }

  /**
   * 删除用户
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回成功与否的boolean
   */
  async deleteUserByOpenid(req: Request, res: Response): Promise<any> {
    try {
      const { openid } = req.params;
      const result = await userService.deleteUserByOpenid(openid);

      logger.info(`删除用户成功: ${openid}`); 
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`删除用户失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.DELETE_USER_FAILED, error.message);
    }
  }

  //--------------------------------邀请码相关--------------------------------
  /**
   * 生成邀请码
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回邀请码
   */
  async generateRedeemCode(req: Request, res: Response): Promise<any> {
    try {
      const openId = req.user.openId;
      const { duration } = req.body;
      const result = await userService.generateRedeemCode(openId, duration);
      
      logger.info(`生成邀请码成功: ${result.code}, 用户: ${openId}`);
      return SuccessHandler(res, { 
        code: result.code,
        expiresAt: result.expiresAt 
      });
    } catch (error: any) {
      logger.error(`生成邀请码失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GENERATE_REDEEM_CODE_FAILED, error.message);
    }
  }

  /**
   * 验证并使用邀请码
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回验证结果
   */
  async verifyRedeemCode(req: Request, res: Response): Promise<any> {
    try {
      const openId = req.user.openId;
      const { code } = req.body;
      const result = await userService.verifyRedeemCode(openId, code);

      logger.info(`验证邀请码成功: ${code}, 用户: ${openId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`验证并使用邀请码失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.VERIFY_REDEEM_CODE_FAILED, error.message);
    }
  }

  //--------------------------------用户反馈相关--------------------------------
  /**
   * 提交反馈
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回反馈结果
   */
  async createFeedback(req: Request, res: Response): Promise<any> {
    try {
      const openId = req.user.openId;
      const { content } = req.body;
      const result = await userService.createFeedback(openId, content);

      logger.info(`提交反馈成功: ${openId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`提交反馈失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.CREATE_FEEDBACK_FAILED, error.message);
    }
  }
} 
export const userController = new UserController();