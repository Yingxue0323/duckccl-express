import User, { IUser } from '../models/User';
import { LanguageCode, LANGUAGES, LOGIN_TYPE } from '../utils/constants';
import { generateToken } from '../utils/jwt';
import logger from '../utils/logger';

class UserService {
  // 创建用户
  async createUser(openid: string, session_key: string): Promise<{ user: IUser, token: string }> {
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
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
  async getUserByOpenid(openId: string): Promise<IUser> {
    const user = await User.findOne({ openId });
    if (!user) throw new Error('User not found');
    return user;
  }

  // 更新用户信息（头像、昵称修改，暂不正式开放）
  async updateUserByOpenid(openId: string, newInfo: any): Promise<IUser> {
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
    const user = await User.findOne({ openId });
    const now = new Date().getTime();
    if (user?.isVIP && user.vipExpireAt && user.vipExpireAt.getTime() > now) {
      return true;
    }
    return false;
  }
  
  // 清除会话(登出)，由auth中的wechatLogout实现
  async clearSession(openId: string) {
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
    const user = await User.findOne({ openId });
    return user?.lang || LANGUAGES.CHINESE;
  }
} 

export const userService = new UserService();   