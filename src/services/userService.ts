import User, { IUser } from '../models/User';
import { LanguageCode, LANGUAGES, LOGIN_TYPE, ROLES } from '../utils/constants';
import logger from '../utils/logger';
import { ParamError } from '../utils/errors';
import { ResponseCode } from '../utils/constants';
import Redeem from '../models/Redeem';
import mongoose from 'mongoose';
import Feedback from '../models/Feedback';

class UserService {
  // 创建用户
  async createUser(openid: string, session_key: string): Promise<IUser> {
    if(!openid || !session_key) throw new ParamError(ResponseCode.INVALID_PARAM, 'openid and session_key are required');
    logger.info(`创建用户: ${openid}`);
    const user = await User.create({
      openId: openid,
      sessionKey: session_key,
      lang: LANGUAGES.CHINESE,
      loginType: LOGIN_TYPE.WECHAT
    }) as IUser;

    return user;
  }

  // TODO: 检查返回格式是否显示
  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    if (!users) throw new Error('Users not found');
    return users;
  }

  // 获取用户信息
  async getUserById(userId: string): Promise<IUser> {
    if(!userId) throw new ParamError(ResponseCode.INVALID_PARAM, 'userId is required');
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
  async getUserByOpenid(openId: string): Promise<IUser> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOne({ openId });
    if (!user) throw new Error('User not found');
    return user;
  }

  // 更新用户信息（头像、昵称修改，暂不正式开放）
  async updateUserByOpenid(openId: string, newInfo: any): Promise<IUser> {
    if(!openId || !newInfo) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId and newInfo are required');
    const user = await User.findOneAndUpdate(
      { openId },
      { $set: newInfo },
      { new: true }
    ) as IUser;
    if (!user) throw new Error('Update user info failed: User not found');
    return user;
  }

  // 更新会话(反复登录)，由auth中的refreshToken实现
  async updateSessionKey(openId: string, sessionKey: string): Promise<IUser> {
    if(!openId || !sessionKey) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId and sessionKey are required');
    const user = await User.findOneAndUpdate(
      { openId: openId },
      { $set: { sessionKey } },
      { new: true }
    ) as IUser;
    if (!user) throw new Error('Update session key failed: User not found');
    return user;
  }

  /**
   * 检查用户是否为VIP
   * @param {string} openId - 用户ID
   * @returns {Promise<boolean>} 返回用户是否为VIP
   */
  async checkVIPStatus(openId: string): Promise<boolean> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOne({ openId });
    const now = new Date().getTime();
    return !!(user?.vipExpireAt && user.vipExpireAt.getTime() > now);
  }
  
  // 清除会话(登出)，由auth中的wechatLogout实现
  async clearSession(openId: string) {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOneAndUpdate(
      { openId: openId },
      { $set: { sessionKey: "" } }
    ) as IUser;
    if (!user) throw new Error('Clear session failed: User not found');
    return { success: true };
  }

  /**
   * 删除用户
   * @param {string} openId - 用户ID
   * @returns {Promise<boolean>} 返回成功与否的boolean
   */
  async deleteUserByOpenid(openId: string) {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOneAndDelete({ openId });
    if (!user) throw new Error('Delete user failed: User not found');
    return true;
  }

 /**
  * 获取用户偏好语言
  * @param {string} openId - 用户ID
  * @returns {Promise<LanguageCode>} 返回用户偏好语言
  */
  async getUserLang(openId: string): Promise<LanguageCode> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOne({ openId });
    return user?.lang || LANGUAGES.CHINESE;
  }

  /**
   * 生成邀请码
   * @param {string} openId - 用户ID
   * @returns {Promise<{code: string}>} 返回邀请码
   */
  async generateRedeemCode(openId: string, duration: number): Promise<{code: string}> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');
    const user = await User.findOne({ openId });
    if(!user) throw new Error('User not found');
    if(user.role !== ROLES.ADMIN) throw new Error('User is not admin');
    
    const code = await this.randomCode();
    await Redeem.create({ 
      inviterOpenId: openId, 
      code, 
      duration: duration
    });
    return { code };
  }

  /**
   * 验证并使用邀请码
   * @param {string} openId - 使用验证码的用户ID
   * @param {string} code - 邀请码
   * @returns {Promise<{success: boolean, vipExpireAt?: Date}>} 返回验证成功与否&被邀请者的VIP过期时间
   */
  async verifyRedeemCode(openId: string, code: string): Promise<{success: boolean, vipExpireAt?: Date}> {
    if(!openId || !code) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId and code are required');

    const redeem = await Redeem.findOne({ 
      code: code.toUpperCase(),
      isUsed: false
    });
    
    if (!redeem) throw new Error('Invalid or expired redeem code');
    if(redeem.isUsed) throw new Error('Redeem code already used');

    // 被邀请者
    const invitee = await User.findOne({ openId: openId });
    if (!invitee) throw new Error('Invitee not found');

    const now = Date.now();
    const isCurrentlyVIP = !!(invitee.vipExpireAt && invitee.vipExpireAt.getTime() > now);

    if (!isCurrentlyVIP) { // 如果用户当前不是VIP
      await this.updateUserByOpenid(openId, 
        { 
          vipExpireAt: new Date(now + redeem.duration * 24 * 60 * 60 * 1000) 
        });
    } else { // 如果用户当前是VIP，则在原有过期时间基础上延长
      const baseTime = Math.max(now, invitee.vipExpireAt?.getTime() ?? 0);
      const newExpireAt = new Date(baseTime + redeem.duration * 24 * 60 * 60 * 1000);

      await this.updateUserByOpenid(openId, {
        vipExpireAt: newExpireAt
      });
    }
    
    // 更新邀请码使用记录
    await Redeem.findOneAndUpdate(
      { code: code.toUpperCase() },
      { 
        $set: { isUsed: true, usedByOpenId: openId, usedAt: new Date() }
      }
    );

    return {
      success: true,
      vipExpireAt: invitee.vipExpireAt
    };
  }

  /**
   * helper function: 生成随机邀请码
   * @returns {Promise<string>} 返回随机邀请码
   */
  async randomCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for(let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * 提交反馈
   * @param {string} openId - 用户ID
   * @param {string} content - 反馈内容
   * @returns {Promise<boolean>} 返回提交成功与否
   */
  async createFeedback(openId: string, content: string): Promise<boolean> {
    if(!openId || !content) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId and content are required');
    const feedback = await Feedback.create({ userOpenId: openId, content });
    if (!feedback) throw new Error('Create feedback failed');
    return true;
  }
} 

export const userService = new UserService();   