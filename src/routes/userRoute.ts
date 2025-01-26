import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware, ipMiddleware } from '../middlewares/authMW';

const router = Router();

// 创建用户
router.post('/', authMiddleware, userController.createUser);

// 获取所有用户，IP限制，目前只对ying开放
router.get('/', ipMiddleware, userController.getAllUsers);

// 获取用户信息 by id/openid
router.get('/:id', authMiddleware, userController.getUserById);
router.get('/openid/:openid', authMiddleware, userController.getUserByOpenid);

// 更新用户信息
router.patch('/:id', authMiddleware, userController.updateUserInfo);

// 更新用户sessionkey，由auth中的refreshToken实现
// 登出时，清除用户sessionkey，由auth中的wechatLogout实现

export default router; 