import { Express } from 'express';
// import wordRoute from './wordRoute';
import exerciseRoute from './exerciseRoute';
import userRoute from './userRoute';
import authRoute from './authRoute';
// import staticRoute from './staticRoute';


export function registerRoutes(app: Express) {
  app.use('/api/v1/auth', authRoute);  //认证相关
  app.use('/api/v1/users', userRoute);  //用户相关

  app.use('/api/v1/exercises', exerciseRoute);  //练习相关

  // app.use('/api/v1/words', wordRoute);  //单词相关
  
}