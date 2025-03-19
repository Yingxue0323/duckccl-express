import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();


router.get('/', authMiddleware, userController.getAllUsers); // 获取所有用户
router.get('/profile', authMiddleware, userController.getUserProfile); // 获取用户信息页面

router.get('/:id', authMiddleware, userController.getUserById); // 获取用户信息 by id
router.get('/openid/:openid', authMiddleware, userController.getUserByOpenid); // 获取用户信息 by openid

router.patch('/openid/:openid', authMiddleware, userController.updateUserByOpenid); // 更新用户信息
router.delete('/openid/:openid', authMiddleware, userController.deleteUserByOpenid); // 删除用户

// 更新用户sessionkey，由auth中的refreshToken实现
// 登出时，清除用户sessionkey，由auth中的wechatLogout实现

//--------------------------------邀请码相关--------------------------------
router.post('/redeem', authMiddleware, userController.generateRedeemCode); // 生成邀请码
router.post('/redeem/verify', authMiddleware, userController.verifyRedeemCode); // 验证并使用邀请码

export default router; 