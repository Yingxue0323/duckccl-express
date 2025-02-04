import { Express } from 'express';
// import wordRoute from './wordRoute';
// import audioRoute from './audioRoute';
// import dialogRoute from './dialogRoute';
import exerciseRoute from './exerciseRoute';
import userRoute from './userRoute';
import authRoute from './authRoute';
// import favoriteRoute from './favoriateRoute';
// import staticRoute from './staticRoute';


export function registerRoutes(app: Express) {
  // 认证相关路由
  app.use('/api/v1/auth', authRoute);
  
  // 用户相关路由
  app.use('/api/v1/users', userRoute);
  
  // 单词相关路由
//   app.use('/api/v1/words', wordRoute);

  // 音频相关路由
  // app.use('/api/v1/audios', audioRoute);

  // 对话相关路由
  // app.use('/api/v1/dialogs', dialogRoute);
  
  // 练习相关路由
  app.use('/api/v1/exercises', exerciseRoute);
  
  // 收藏相关路由
  // app.use('/api/v1/favorites', favoriteRoute);
  
//   // 静态内容路由
//   app.use('/api/static', staticRoute);
  
  // 可以添加更多路由...
}