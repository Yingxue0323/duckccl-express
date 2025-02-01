import { Request, Response } from 'express';
import { exerciseService } from '../services/exerciseService';
import logger from '../utils/logger';

class ExerciseController {
  // 获取练习列表
  async getAllExercises(req: Request, res: Response) {
    try {
      const result = await exerciseService.getAllExercises(req.user._id.toString());

      logger.info(`获取练习列表成功: 已学${result.learnedCount} 已收藏${result.favoriteCount}`);
      return res.json(result);

    } catch (error: any) {
      logger.error(`获取练习列表失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取单个练习详情
  async getExerciseById(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const result = await exerciseService.getExerciseById(exerciseId, userId);

      logger.info(`获取练习详情成功: ${result.message}`);
      return res.json(result);

    } catch (error: any) {
      logger.error(`获取练习详情失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 更新学习状态
  async updateLearningStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const isLearned = req.body.isLearned;
      const status = await exerciseService.updateLearningStatus(userId, exerciseId, isLearned);

      logger.info(`更新学习状态成功: ${status.message}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 收藏/取消收藏练习
  async updateFavoriteStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const isFavorite = req.body.isFavorite;
      const status = await exerciseService.updateFavoriteStatus(userId, exerciseId, isFavorite);

      logger.info(`更新收藏状态成功: ${status.message}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  //管理员
  // 创建练习
  async createExercise(req: Request, res: Response) {
    try { 
      const exercise = req.body;
      const result = await exerciseService.createExercise(exercise);

      logger.info(`创建练习成功: ${result.message}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`创建练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 更新练习
  async updateExercise(req: Request, res: Response) {
    try {
      const exercise = req.body;
      const result = await exerciseService.updateExercise(exercise);

      logger.info(`更新练习成功: ${result.message}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`更新练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 删除练习
  async deleteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const result = await exerciseService.deleteExercise(exerciseId);

      logger.info(`删除练习成功: ${result.message}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`删除练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const exerciseController = new ExerciseController();