import axios from 'axios';
import logger from './logger';
import { config } from '../configs';

interface WxSession {
  session_key: string;
  openid: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

export async function code2Session(code: string): Promise<WxSession> {
  try {
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: config.wx.appId,
        secret: config.wx.appSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const data = response.data;
    if (data.errcode) {
        logger.error('微信接口jscode2session返回错误:', {
          errcode: data.errcode,
          errmsg: data.errmsg
        });
        throw data;
    }

    return data;
  } catch (error: any) {
    logger.error('调用微信接口失败:', error);
    throw new Error('微信服务调用失败');
  }
} 