import { Request, Response } from 'express';
import { exerciseService } from '../services/exerciseService';
import logger from '../utils/logger';

class ExerciseController {
  // 创建练习
  async createExercise(req: Request, res: Response) {
    try { 
      const exercise = req.body;
      const result = await exerciseService.createExercise(exercise);

      logger.info(`创建练习成功: ${result.exercise._id}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`创建练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取所有练习
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

      logger.info(`获取练习详情成功: ${result.data._id}`);
      return res.json(result);

    } catch (error: any) {
      logger.error(`获取练习详情失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 更新练习
  async updateExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const exercise = req.body;
      const result = await exerciseService.updateExercise(exerciseId, exercise);

      logger.info(`更新练习成功: ${result.updatedExercise._id}`);
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

      logger.info(`删除练习成功: ${result.exerciseId}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`删除练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取学习状态
  async getLearningStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const result = await exerciseService.getLearningStatus(userId, exerciseId);
  
      logger.info(`获取学习状态成功: ${result.isLearned}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`获取学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 获取收藏状态
  async getFavoriteStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const result = await exerciseService.getFavoriteStatus(userId, exerciseId);
  
      logger.info(`获取收藏状态成功: ${result.isFavorite}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`获取收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  } 

  // 标为已学
  async learnExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exerciseService.updateLearningStatus(userId, exerciseId, true);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 标为未学
  async unlearnExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exerciseService.updateLearningStatus(userId, exerciseId, false);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 收藏练习
  async favoriteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exerciseService.updateFavoriteStatus(userId, exerciseId, 'Exercise', true);

      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 取消收藏练习
  async unfavoriteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exerciseService.updateFavoriteStatus(userId, exerciseId, 'Exercise', false);
  
      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }
}

export const exerciseController = new ExerciseController();