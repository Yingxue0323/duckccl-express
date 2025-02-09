import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

router.get('/', authMiddleware, exerciseController.getAudio); // 音频流式传输

// 收藏功能
router.get('/:id/favorites', authMiddleware, exerciseController.getFavoriteAudioStatus); // 获取收藏状态
router.post('/:id/favorites', authMiddleware, exerciseController.favoriteAudio); // 收藏音频
router.delete('/:id/favorites', authMiddleware, exerciseController.unfavoriteAudio); // 取消收藏音频

export default router; 
