import { Request as ExpressRequest } from 'express';
import { IUser } from '../models/User';
import { IExercise } from '../models/Exercise';

// 基础请求类型
export interface Request extends ExpressRequest {
  user: IUser;  // 移除可选标记
  exercise?: IExercise;
}

// 可选认证的请求类型
export interface OptionalAuthRequest extends ExpressRequest {
  user?: IUser;
  exercise?: IExercise;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;  // 移除可选标记
      exercise?: IExercise;
    }
  }
}