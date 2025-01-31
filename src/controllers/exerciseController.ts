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
  // async updateLearningStatus(req: Request, res: Response) {
  //   try {
  //     const status = await exerciseService.updateLearningStatus(
  //       req.user._id,
  //       req.params.id,
  //       req.body.isLearned
  //     );
  //     return res.json(status);
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // }

  // // 收藏/取消收藏练习
  // async updateFavoriteStatus(req: Request, res: Response) {
  //   try {
  //     const status = await exerciseService.updateFavoriteStatus(req.user._id, req.params.id, req.body.isFavorite);
  //     return res.json(status);
  //   } catch (error: any) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // }
}

export const exerciseController = new ExerciseController();