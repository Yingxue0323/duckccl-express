import { userService } from '../services/userService';
import { code2Session } from '../utils/wechat';
import { clearUserTokens, generateToken, verifyToken } from '../utils/jwt';
import { IUser } from '../models/User';
import User from '../models/User';
import { ParamError } from '../utils/errors';
import { ResponseCode } from '../utils/constants';

class AuthService {
  async wechatLogin(code: string, withToken: string | null): Promise<any> {
    if(!code) throw new ParamError(ResponseCode.INVALID_PARAM, 'code is required');

    // 1. 获取openid和session_key
    const wxSession = await code2Session(code);
    const { openid, session_key } = wxSession;

    // 2. 查找或创建用户
    let user = await User.findOne({ openId: openid }) as IUser;
    // 2a. 如不存在，创建新用户
    if (!user) {
      const { user: newUser, token } = await userService.createUser(openid, session_key);
      return { user: newUser, token };
    }
    // 2b. 否则更新用户信息
    user = await userService.updateSessionKey(openid, session_key);

    // 3. 处理token
    let token = null;
    //3a. 可能带有token
    if (withToken !== null) {
      const isValid = await verifyToken(user.openId, withToken);
      if (isValid) {  //数据库验证通过, 使用已有token
        token = withToken;
      } else {  //数据库验证不通过，删除已有token，生成新token
        await clearUserTokens(user.openId);
        token = await generateToken(user.openId);
      }
    } else {  //3b 不带token，直接生成新token
      token = await generateToken(user.openId);
    }

    return { user, token };
  }


  // 刷新 token
  async refreshToken(code: string): Promise<{ token: string }> {
    if(!code) throw new ParamError(ResponseCode.INVALID_PARAM, 'code is required');

    // 1. 获取新的微信会话
    const wxSession = await code2Session(code);
    // 2. 更新用户会话
    const user = await userService.updateSessionKey(wxSession.openid, wxSession.session_key);
    
    // 3.检查是否有已有token，删除后再创建新的token
    await clearUserTokens(user.openId);
    // 4. 生成新 token
    const token = await generateToken(user.openId);
    
    return { token };
  }

  async wechatLogout(openId: string): Promise<void> {
    if(!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'openId is required');

    // 1. 删除所有token
    await clearUserTokens(openId);
    // 2. 清除用户会话
    await userService.clearSession(openId);
  }
}

export const authService = new AuthService();