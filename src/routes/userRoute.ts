import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();


router.get('/', authMiddleware, userController.getAllUsers); // 获取所有用户

router.get('/:id', authMiddleware, userController.getUserById); // 获取用户信息 by id
router.get('/openid/:openid', authMiddleware, userController.getUserByOpenid); // 获取用户信息 by openid

router.patch('/:id', authMiddleware, userController.updateUser); // 更新用户信息
router.delete('/:id', authMiddleware, userController.deleteUser); // 删除用户

// 更新用户sessionkey，由auth中的refreshToken实现
// 登出时，清除用户sessionkey，由auth中的wechatLogout实现

export default router; 