import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

// 用户
// 获取练习列表
router.get('/', authMiddleware, exerciseController.getAllExercises);

// 获取单个练习详情
router.get('/:id', authMiddleware, exerciseController.getExerciseById);

// 更新学习状态（已学/未学）
router.patch('/:id/learning', authMiddleware, exerciseController.updateLearningStatus);

// 收藏/取消收藏练习
router.patch('/:id/favorite', authMiddleware, exerciseController.updateFavoriteStatus);


// 管理员
// 创建练习
router.post('/', authMiddleware, exerciseController.createExercise);

// // 更新练习
// router.patch('/:id', authMiddleware, exerciseController.updateExercise);

// // 删除练习
// router.delete('/:id', authMiddleware, exerciseController.deleteExercise);

export default router; 
