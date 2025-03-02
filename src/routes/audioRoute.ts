import { Router } from 'express';
import { audioController } from '../controllers/audioController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

// 基础curd
router.get('/', authMiddleware, audioController.getAllAudios); // 获取音频列表，通过user profile -> favoriate audios进入
router.get('/:id', authMiddleware, audioController.getAudioById); // 获取音频详情，通过user profile -> favoriate audios进入
router.get('/exercise/:id', authMiddleware, audioController.getAudioByExerciseId); // 获取一个练习中的所有音频, exercise -> 进入

// TODO: admin only
router.post('/', audioController.createAudio); // 创建音频, admin only
router.patch('/:id', audioController.updateAudio); // 更新音频, admin only
router.delete('/:id', audioController.deleteAudio); // 删除音频, admin only

// 收藏功能
router.get('/:id/favorites', authMiddleware, audioController.getFavoriteAudioStatus); // 获取收藏状态，只是检查，不返回音频信息
router.post('/:id/favorites', authMiddleware, audioController.favoriteAudio); // 收藏音频，练习页面进入
router.delete('/:id/favorites', authMiddleware, audioController.unfavoriteAudio); // 取消收藏音频，练习页面进入

export default router; 
