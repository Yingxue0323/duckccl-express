import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

//TODO: 后期分离管理员角色

// 基础curd
router.post('/', authMiddleware, exerciseController.createExercise);    // 创建练习
router.get('/', authMiddleware, exerciseController.getAllExercises); // 获取练习列表
router.get('/categories', authMiddleware, exerciseController.getExerciseByCategories); // 获取分类练习列表

router.get('/:id', authMiddleware, exerciseController.getExerciseById); // 获取单个练习详情
router.patch('/:id', authMiddleware, exerciseController.updateExercise); // 更新练习
router.delete('/:id', authMiddleware, exerciseController.deleteExercise); // 删除练习

// 学习状态：已学/未学，仅限练习题
router.get('/:id/learning', authMiddleware, exerciseController.getLearningStatus); // 获取学习状态
router.post('/:id/learning', authMiddleware, exerciseController.learnExercise); // 标为已学
router.delete('/:id/learning', authMiddleware, exerciseController.unlearnExercise); // 标为未学

// 收藏功能
router.get('/:id/favorites', authMiddleware, exerciseController.getFavoriteExerciseStatus); // 获取收藏状态
router.post('/:id/favorites', authMiddleware, exerciseController.favoriteExercise); // 收藏练习
router.delete('/:id/favorites', authMiddleware, exerciseController.unfavoriteExercise); // 取消收藏练习

export default router; 
