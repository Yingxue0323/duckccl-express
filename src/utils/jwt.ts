import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../configs';
import { Secret } from 'jsonwebtoken';

interface JwtPayload {
  openId: string;
  exp?: number;      // 过期时间
  iat?: number;      // 签发时间
}

export const generateToken = (openId: string): string => {
  return jwt.sign(
    { openId },
    config.jwt.secret as Secret,
    { expiresIn: config.jwt.expiresIn } as SignOptions
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}; 