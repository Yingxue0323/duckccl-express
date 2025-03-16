import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

router.post('/login', authController.wechatLogin);  // 微信登录
router.post('/refresh-token', authController.refreshToken);  // 刷新 token
router.delete('/logout', authMiddleware, authController.wechatLogout);  // 微信登出

export default router; 