import { Router } from 'express';
import { wordController } from '../controllers/wordController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

//TODO: 后期分离管理员角色
// ----------------------------------------- 菜单 -----------------------------------------
router.get('/menus', authMiddleware, wordController.getMenus); //获取菜单项目

// ----------------------------------------- 基础curd -----------------------------------------
router.post('/', authMiddleware, wordController.createWord);    // 创建单词
router.get('/', authMiddleware, wordController.getAllWords); // 获取单词列表，可筛选、可分页、指定随机
router.get('/:id', authMiddleware, wordController.getWordById); // 获取单个单词详情
router.patch('/:id', authMiddleware, wordController.updateWord); // 更新单词
router.delete('/:id', authMiddleware, wordController.deleteWord); // 删除单词

// ----------------------------------------- 学习状态 -----------------------------------------
router.get('/:id/learning', authMiddleware, wordController.getLearningStatus); // 获取学习状态
router.post('/:id/learning', authMiddleware, wordController.updateLearningStatus); // 更新学习状态

// ----------------------------------------- 收藏 -----------------------------------------
router.get('/:id/favorites', authMiddleware, wordController.getFavoriteWordStatus); // 获取收藏状态
router.post('/:id/favorites', authMiddleware, wordController.favoriteWord); // 收藏单词
router.delete('/:id/favorites', authMiddleware, wordController.unfavoriteWord); // 取消收藏单词

export default router; 
