import { userService } from '../services/userService';
import { code2Session } from '../utils/wechat';
import { generateToken } from '../utils/jwt';

class AuthService {
  async wechatLogin(code: string) {
    // 1. 获取openid和session_key
    const wxSession = await code2Session(code);
    const { openid, session_key } = wxSession;

    // 2. 查找或创建用户
    let user = await userService.getUserByOpenid(openid);

    if (!user) { // 3a. 创建新用户
      const { user: newUser, token } = await userService.createUser(openid, session_key);
      return { user: newUser, token };
    }

    // 3b. 更新用户信息
    user = await userService.updateSessionKey(user._id.toString(), session_key);
    const token = generateToken(user._id.toString());  // 重新生成 token

    return { user, token };
  }


  // 刷新 token
  async refreshToken(code: string): Promise<{ token: string }> {
    // 1. 获取新的微信会话
    const wxSession = await code2Session(code);
    
    // 2. 更新用户会话
    const user = await userService.updateSessionKey(wxSession.openid, wxSession.session_key);
    
    // 3. 生成新 token
    const token = generateToken(user._id.toString());
    
    return { token };
  }

  async wechatLogout(userId: string): Promise<{ success: boolean }> {
    const result = await userService.clearSession(userId);
    return result;
  }
}

export const authService = new AuthService();