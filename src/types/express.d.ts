import { Request as ExpressRequest } from 'express';
import { IUser } from '../models/User';
import { IExercise } from '../models/Exercise';

export interface Request extends ExpressRequest {
  user: IUser;
  exercise?: IExercise;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      exercise?: IExercise;
    }
  }
}