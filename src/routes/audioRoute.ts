import { Router } from 'express';
import { audioController } from '../controllers/audioController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

//TODO: 后期分离管理员角色

// 基础curd
router.post('/', authMiddleware, audioController.createAudio);    // 创建音频
router.get('/', authMiddleware, audioController.getAllAudios); // 获取音频列表
router.get('/:id', authMiddleware, audioController.getAudioById); // 获取单个音频详情
router.patch('/:id', authMiddleware, audioController.updateAudio); // 更新音频
router.delete('/:id', authMiddleware, audioController.deleteAudio); // 删除音频

// 收藏
router.get('/:id/favorites', authMiddleware, audioController.getFavoriteStatus); // 获取收藏状态
router.post('/:id/favorites', authMiddleware, audioController.favoriteAudio); // 收藏音频
router.delete('/:id/favorites', authMiddleware, audioController.unfavoriteAudio); // 取消收藏音频

export default router; 
