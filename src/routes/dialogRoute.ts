import { Router } from 'express';
import { dialogController } from '../controllers/dialogController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

//TODO: 后期分离管理员角色

// 基础curd
router.post('/', authMiddleware, dialogController.createDialog);    // 创建对话
router.get('/', authMiddleware, dialogController.getAllDialogs); // 获取对话列表
router.get('/:id', authMiddleware, dialogController.getDialogById); // 获取单个对话详情
router.patch('/:id', authMiddleware, dialogController.updateDialog); // 更新对话
router.delete('/:id', authMiddleware, dialogController.deleteDialog); // 删除对话


export default router; 
