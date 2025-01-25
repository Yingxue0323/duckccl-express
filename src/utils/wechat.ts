import axios from 'axios';
import logger from '../configs/logger';

interface WxSession {
  session_key: string;
  openid: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export async function code2Session(code: string): Promise<WxSession> {
  const url = 'https://api.weixin.qq.com/sns/jscode2session';
  const params = {
    appid: process.env.WX_APPID,
    secret: process.env.WX_SECRET,
    js_code: code,
    grant_type: 'authorization_code'
  };

  try {
    const { data } = await axios.get<WxSession>(url, { params });
    
    if (data.errcode) {
      logger.error('微信登录失败:', data);
      throw new Error(data.errmsg || '微信登录失败');
    }

    return data;
  } catch (error) {
    logger.error('调用微信接口失败:', error);
    throw new Error('微信服务异常');
  }
} 