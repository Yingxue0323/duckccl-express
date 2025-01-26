import UserService from '../services/userService';
import { code2Session } from '../utils/wechat';
import { generateToken } from '../utils/jwt';

class AuthService {
  async wechatLogin(code: string) {
    // 1. 获取openid和session_key
    const wxSession = await code2Session(code);
    const { openid, session_key } = wxSession;

    // 2. 查找或创建用户
    let user = await UserService.getUserByOpenid(openid);

    if (!user) { // 3a. 创建新用户
      user = await UserService.createUser(openid, session_key);
    } else { // 3b. 更新用户信息
      user = await UserService.updateUserSessionKey(user._id.toString(), session_key);
    }

    // 生成 JWT token
    const token = generateToken(user._id.toString());

    // 5. 返回用户信息和token
    return { user, token };
  }

  // 刷新 token
  async refreshToken(code: string): Promise<{ token: string }> {
    // 1. 获取新的微信会话
    const wxSession = await code2Session(code);
    
    // 2. 更新用户会话
    const user = await UserService.updateUserSessionKey(wxSession.openid, wxSession.session_key);
    
    // 3. 生成新 token
    const token = generateToken(user._id.toString());
    
    return { token };
  }

  async wechatLogout(userId: string): Promise<{ success: boolean }> {
    const result = await UserService.clearSession(userId);
    return result;
  }
}

export const authService = new AuthService();