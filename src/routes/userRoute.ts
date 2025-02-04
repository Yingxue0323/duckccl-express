import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();


// 获取所有用户
router.get('/', authMiddleware, userController.getAllUsers);

// 获取用户信息 by id/openid
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/openid/:openid', authMiddleware, userController.getUserByOpenid);

// 更新用户信息
router.patch('/:id', authMiddleware, userController.updateUserInfo);

// 更新用户sessionkey，由auth中的refreshToken实现
// 登出时，清除用户sessionkey，由auth中的wechatLogout实现

export default router; 