import jwt from 'jsonwebtoken';
import { config } from '../configs';

interface JwtPayload {
  openId: string;
  exp?: number;      // 过期时间
  iat?: number;      // 签发时间
}

export const generateToken = (openId: string): string => {
  return jwt.sign(
    { openId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}; 