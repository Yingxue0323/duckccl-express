import User, { IUser } from '../models/User';
import { LanguageCode, LANGUAGES, LOGIN_TYPE } from '../utils/constants';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';
import { ParamError } from '../utils/errors';
import { ResponseCode } from '../utils/constants';
import Redeem from '../models/Redeem';
import mongoose from 'mongoose';
import schedule from 'node-schedule';

class UserService {
  constructor() {
    // 每周一凌晨2点执行清理
    schedule.scheduleJob('0 2 * * 1', () => {
      this.cleanExpiredRedeemCodes();
    });
  }

  // 创建用户
  async createUser(openid: string, session_key: string): Promise<{ user: IUser, token: string }> {
    if(!openid || !session_key) throw new ParamError(ResponseCode.INVALID_PARAM, 'openid and session_key are required');
    logger.info(`创建用户: ${openid}`);
    const user = await User.create({
      openId: openid,
      sessionKey: session_key,
      lang: LANGUAGES.CHINESE,
      loginType: LOGIN_TYPE.WECHAT
    }) as IUser;

    const token = await generateToken(user.openId);
    return { user, token };
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
    if (user?.isVIP && user.vipExpireAt && user.vipExpireAt.getTime() > now) {
      return true;
    }
    return false;
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
   * @returns {Promise<{code: string, expiresAt: Date}>} 返回邀请码和过期时间
   */
  async generateRedeemCode(openId: string): Promise<{code: string, expiresAt: Date}> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');

    // 防止短时间内生成大量邀请码
    const lastCode = await Redeem.findOne({ inviterOpenId: openId }).sort({ createdAt: -1 });
    if(lastCode && lastCode.createdAt > new Date(Date.now() - 1000 * 60 * 60 * 1)) {
      throw new Error('Please wait 1 hours before generating a new redeem code');
    }

    const code = await this.randomCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Redeem.create({ 
      inviterOpenId: openId, 
      code, 
      duration: 7,
      expiresAt 
    });
    return { code, expiresAt };
  }

  /**
   * 清理过期的邀请码
   * @returns {Promise<number>} 返回清理的数量
   */
  private async cleanExpiredRedeemCodes(): Promise<number> {
    try {
      const result = await Redeem.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      
      logger.info(`清理过期邀请码成功，共删除 ${result.deletedCount} 条`);
      return result.deletedCount;
    } catch (error) {
      logger.error('清理过期邀请码失败:', error);
      throw error;
    }
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
      expiresAt: { $gt: new Date() }  // 直接在查询时过滤过期的
    });
    
    if (!redeem) throw new Error('Invalid or expired redeem code');

    if(openId === redeem.inviterOpenId) throw new Error('Inviter cannot use own redeem code');
    if(redeem.usedBy.some(used => used.usedByOpenId === openId)) throw new Error('Redeem code already used by this user');

    // 更新邀请者的VIP时间
    const inviter = await User.findOne({ openId: redeem.inviterOpenId });
    const inviterNewExpireAt = inviter?.vipExpireAt && inviter.vipExpireAt > new Date() 
      ? new Date(inviter.vipExpireAt.getTime() + 7 * 24 * 60 * 60 * 1000)  // 如果还是VIP，在原来基础上加7天
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 如果不是VIP，从现在开始算7天

    // 更新被邀请者的VIP时间
    const invitee = await User.findOne({ openId: openId });
    const inviteeNewExpireAt = invitee?.vipExpireAt && invitee.vipExpireAt > new Date()
      ? new Date(invitee.vipExpireAt.getTime() + 7 * 24 * 60 * 60 * 1000)  // 如果还是VIP，在原来基础上加7天
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // 如果不是VIP，从现在开始算7天

    // 确保数据一致性
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // 更新邀请者和被邀请者的VIP状态+redeem状态
      const [inviterUpdate, inviteeUpdate] = await Promise.all([
        User.findOneAndUpdate(
          { openId: redeem.inviterOpenId },
          { $set: { isVIP: true, vipExpireAt: inviterNewExpireAt } },
          { session, new: true }
        ),
        User.findOneAndUpdate(
          { openId },
          { $set: { isVIP: true, vipExpireAt: inviteeNewExpireAt } },
          { session, new: true }
        ),
        Redeem.findOneAndUpdate(
          { code: code.toUpperCase() },
          { 
            $push: { usedBy: { usedByOpenId: openId, usedAt: new Date() } },
            $set: { isUsed: redeem.usedBy.length + 1 >= redeem.maxUses }  // 可以添加最大使用次数限制
          },
          { session }
        )
      ]);

      await session.commitTransaction();
      return {
        success: true,
        vipExpireAt: inviteeUpdate?.vipExpireAt
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
} 

export const userService = new UserService();   