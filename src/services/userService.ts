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
      lang: LANGUAGES.CHINESE_SIMPLIFIED,
      loginType: LOGIN_TYPE.WECHAT
    });
    const result = await user.save();
    const token = generateToken(result._id.toString());

    return { user: result, token };
  }

  // TODO: 检查返回格式是否显示
  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  // 获取用户信息
  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }
  async getUserByOpenid(openid: string): Promise<IUser> {
    const user = await User.findOne({ openId:openid });
    if (!user) throw new Error('User not found');
    return user;
  }

  // 更新用户信息（头像、昵称修改，暂不正式开放）
  async updateUser(userId: string, newInfo: any): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: newInfo },
      { new: true }
    ) as IUser;
    return user;
  }

  // 更新会话(反复登录)，由auth中的refreshToken实现
  async updateSessionKey(userId: string, sessionKey: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { sessionKey } },
      { new: true }
    ) as IUser;
    return user;
  }

  /**
   * 检查用户是否为VIP
   * @param {string} userId - 用户ID
   * @returns {Promise<boolean>} 返回用户是否为VIP
   */
  async checkVIPStatus(userId: string): Promise<boolean> {
    const user = await User.findById(userId);
    const now = new Date().getTime();
    if (user?.isVIP && user.vipExpireAt && user.vipExpireAt.getTime() > now) {
      return true;
    }
    return false;
  }
  
  // 清除会话(登出)，由auth中的wechatLogout实现
  async clearSession(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { sessionKey: '' } }
    ) as IUser;
    return { success: true };
  }

  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {Promise<boolean>} 返回成功与否的boolean
   */
  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');
    return true;
  }

 /**
  * 获取用户偏好语言
  * @param {string} userId - 用户ID
  * @returns {Promise<LanguageCode>} 返回用户偏好语言
  */
  async getUserLang(userId: string): Promise<LanguageCode> {
    const user = await User.findById(userId);
    return user?.lang || LANGUAGES.CHINESE_SIMPLIFIED;
  }
} 

export const userService = new UserService();   