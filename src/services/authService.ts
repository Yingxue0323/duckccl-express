import { userService } from '../services/userService';
import { code2Session } from '../utils/wechat';
import { clearUserTokens, generateToken, verifyToken } from '../utils/jwt';
import { IUser } from '../models/User';
import User from '../models/User';

class AuthService {
  async wechatLogin(code: string): Promise<any> {
    // 1. 获取openid和session_key
    const wxSession = await code2Session(code);
    const { openid, session_key } = wxSession;

    // 2. 查找或创建用户
    let user = await User.findOne({ openId: openid }) as IUser;

    if (!user) { // 3a. 如不存在，创建新用户
      const { user: newUser, token } = await userService.createUser(openid, session_key);
      return { user: newUser, token };
    }

    // 3b. 否则更新用户信息
    user = await userService.updateSessionKey(openid, session_key);
    const token = await generateToken(user.openId);

    return { user, token };
  }


  // 刷新 token
  async refreshToken(code: string): Promise<{ token: string }> {
    // 1. 获取新的微信会话
    const wxSession = await code2Session(code);
    
    // 2. 更新用户会话
    const user = await userService.updateSessionKey(wxSession.openid, wxSession.session_key);
    
    // 3. 生成新 token
    const token = await generateToken(user.openId);
    
    return { token };
  }

  async wechatLogout(openId: string): Promise<{ success: boolean }> {
    await clearUserTokens(openId);

    const result = await userService.clearSession(openId);
    return result;
  }
}

export const authService = new AuthService();