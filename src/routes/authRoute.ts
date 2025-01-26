import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

// 微信登录
router.post('/login', authController.wechatLogin);

// 刷新 token
router.post('/refresh-token', authController.refreshToken);

// 微信登出
router.delete('/logout', authMiddleware, authController.wechatLogout);

export default router; 