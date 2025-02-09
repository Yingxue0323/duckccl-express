import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  adminSecretKey: process.env.ADMIN_SECRET_KEY!,
  wx: {
    appId: process.env.WX_APPID!,
    appSecret: process.env.WX_SECRET!,
    keysPath: process.env.WX_KEYS_PATH!,
    publicKey: process.env.WX_PUBLIC_KEY!,
    privateKey: process.env.WX_PRIVATE_KEY!,
    certificate: process.env.WX_CERTIFICATE!
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!
  },
  mongodb: {
    uri: process.env.MONGODB_URI!
  },
  adminIp: process.env.ADMIN_IP!
};
