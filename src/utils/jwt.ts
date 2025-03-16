import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../configs';
import { Secret } from 'jsonwebtoken';
import Token from '../models/Token';

/**
 * 生成token
 * @param openId 
 * @returns {string} token
 */
export const generateToken = async (openId: string): Promise<string> => {
  // 1. 生成token
  const tokenDoc = jwt.sign(
    { openId },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );

  // 2. 计算过期时间
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // 3. 保存token到数据库
  await new Token({ openId, token: tokenDoc, expiresAt }).save();

  return tokenDoc;
};

/**
 * 验证token(清除过期token),不验证token是否有效
 * @param {string} openId 
 * @param {string} token 
 * @returns {boolean} 是否有效
 */
export const verifyToken = async (openId: string, token: string): Promise<boolean> => {
  try {
    //1.检查对应用户的token是否在数据库中存在
    const tokenDoc = await Token.findOne({ 
      openId: openId,
      token: token
    });
    if (!tokenDoc) return false;

    // 如果token已过期，则删除token并返回false
    if (tokenDoc.expiresAt < new Date()) {
      await Token.deleteOne({ token: token });
      return false;
    }

    return true;

  } catch (error) {
    throw error;
  }
}

/**
 * 清除用户所有token
 * @param openId 
 */
export const clearUserTokens = async (openId: string): Promise<void> => {
  await Token.deleteMany({ openId: openId });
};