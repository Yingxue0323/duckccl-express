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
    // 添加日志记录请求参数
    logger.info(`开始调用微信登录接口，参数：${JSON.stringify({
      appid: config.wx.appId,
      js_code: code,
    })}`);
    
    const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
            appid: config.wx.appId,
            secret: config.wx.appSecret,
            js_code: code,
            grant_type: 'authorization_code'
        }
      });

    const data = response.data;
    logger.info(`微信接口返回数据：${JSON.stringify(data)}`);

    if (data.errcode) {
        logger.error(`微信接口jscode2session返回错误: ${JSON.stringify(data)}`);
        throw new Error(data.errmsg || `微信接口返回错误: ${data.errcode}`);
    }

    return data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // 网络请求错误
      logger.error(`调用code2Session网络错误: ${JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          params: error.config?.params
        }
      })}`);
      throw new Error(`微信服务网络请求错误: ${error.message}`);
    } else {
      // 其他错误
      logger.error(`调用code2Session其他错误: ${JSON.stringify(error)}`);
      throw error;
    }
  }
} 