import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

//TODO: 后期分离管理员角色

// 基础curd
router.post('/', authMiddleware, exerciseController.createExercise);    // 创建练习
router.get('/', authMiddleware, exerciseController.getAllExercises); // 获取练习列表
router.get('/:id', authMiddleware, exerciseController.getExerciseById); // 获取单个练习详情
router.patch('/:id', authMiddleware, exerciseController.updateExercise); // 更新练习
router.delete('/:id', authMiddleware, exerciseController.deleteExercise); // 删除练习

// 音频流式传输
router.get('/audio', authMiddleware, exerciseController.getAudio);

// 学习状态：已学/未学，仅限练习题
router.get('/:id/learning', authMiddleware, exerciseController.getLearningStatus); // 获取学习状态
router.post('/:id/learning', authMiddleware, exerciseController.learnExercise); // 标为已学
router.delete('/:id/learning', authMiddleware, exerciseController.unlearnExercise); // 标为未学

// 收藏功能，练习题+单段音频
// 练习题收藏
router.get('/:exerciseId/favorites', authMiddleware, exerciseController.getFavoriteExerciseStatus); // 获取收藏状态
router.post('/:exerciseId/favorites', authMiddleware, exerciseController.favoriteExercise); // 收藏练习
router.delete('/:exerciseId/favorites', authMiddleware, exerciseController.unfavoriteExercise); // 取消收藏练习

// 单段音频收藏
router.get('/:exerciseId/:dialogId/:audioId/favorites', authMiddleware, exerciseController.getFavoriteAudioStatus); // 获取收藏状态
router.post('/:exerciseId/:dialogId/:audioId/favorites', authMiddleware, exerciseController.favoriteAudio); // 收藏音频
router.delete('/:exerciseId/:dialogId/:audioId/favorites', authMiddleware, exerciseController.unfavoriteAudio); // 取消收藏音频

export default router; 
