import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

// ----------------------------------------- 菜单 -----------------------------------------
router.get('/menus', authMiddleware, exerciseController.getMenus); //获取菜单项目

// ----------------------------------------- 基础curd -----------------------------------------
router.post('/',  exerciseController.createExercise);    // 创建练习, TODO: admin only
// 获取所有练习列表，支持分类多选和分页，eg./api/v1/exercises?category=business&category=law&...
router.get('/', authMiddleware, exerciseController.getAllExercises);
router.get('/:id', authMiddleware, exerciseController.getExerciseById); // 获取单个练习详情
router.patch('/:id', authMiddleware, exerciseController.updateExercise); // 更新练习, TODO: admin only
router.delete('/:id', authMiddleware, exerciseController.deleteExercise); // 删除练习, TODO: admin only

// ----------------------------------------- 学习状态 -----------------------------------------
router.get('/:id/learning', authMiddleware, exerciseController.getLearningStatus); // 获取学习状态，基本都是内部绕过直接调用service方法
router.post('/:id/learning', authMiddleware, exerciseController.learnExercise); // 标为已学，系统自动
router.delete('/:id/learning', authMiddleware, exerciseController.unlearnExercise); // 标为未学，系统自动

// ----------------------------------------- 收藏功能 -----------------------------------------
router.get('/:id/favorites', authMiddleware, exerciseController.getFavoriteExerciseStatus); // 获取收藏状态，基本都是内部绕过直接调用service方法
router.post('/:id/favorites', authMiddleware, exerciseController.favoriteExercise); // 收藏练习
router.delete('/:id/favorites', authMiddleware, exerciseController.unfavoriteExercise); // 取消收藏练习

export default router; 
