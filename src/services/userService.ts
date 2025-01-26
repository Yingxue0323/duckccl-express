import User, { IUser } from '../models/User';
import { LANGUAGES, LOGIN_TYPE } from '../utils/constants';
import { code2Session } from '../utils/wechat';
import { generateToken } from '../utils/jwt';

class UserService {
  // 创建用户
  async createUser(code: string): Promise<{ user: IUser, token: string }> {
    const wxSession = await code2Session(code);
    const { openid, session_key } = wxSession;
    
    const user = await User.create({
      openId: openid,
      sessionKey: session_key,
      lang: LANGUAGES.CHINESE_SIMPLIFIED,
      loginType: LOGIN_TYPE.WECHAT
    });
    const token = generateToken(user._id.toString());

    return { user, token };
  }

  // TODO: 检查返回格式是否显示
  async getAllUsers(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  // 获取用户信息
  async getUserById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    return user;
  }
  async getUserByOpenid(openid: string): Promise<IUser | null> {
    const user = await User.findOne({ openId:openid });
    return user;
  }

  // 更新用户信息（头像、昵称修改，暂不正式开放）
  async updateUserInfo(userId: string, newInfo: any): Promise<IUser> {
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
  
  // 清除会话(登出)，由auth中的wechatLogout实现
  async clearSession(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { sessionKey: '' } }
    ) as IUser;
    return { success: true };
  }
} 

export const userService = new UserService();   