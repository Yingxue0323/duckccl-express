import { Request } from '../types/express';
import { Response } from 'express';
import { exerciseService } from '../services/exerciseService';
import { exeFavService } from '../services/exeFavService';
import { exeLearnService } from '../services/exeLearnService';
import logger from '../utils/logger';

class ExerciseController {
//-----------------------------------------------基础CURD-----------------------------------------------
  /**
   * 创建练习
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回创建后的exercise对象
   */
  async createExercise(req: Request, res: Response) {
    try { 
      const exercise = req.body;
      const result = await exerciseService.createExercise(exercise);

      logger.info(`创建练习成功: ${result.exercise._id}`);
      return res.json({ 
        message: '创建练习成功',
        result
      });
    } catch (error: any) {
      logger.error(`创建练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'CREATE_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 获取所有练习
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回练习列表
   */
  async getAllExercises(req: Request, res: Response) {
    try {
      const result = await exerciseService.getAllExercises(req.user._id.toString());

      logger.info(`获取练习列表成功: 已学${result.learnedCount} 已收藏${result.favoriteCount}`);
      return res.json({ 
        message: '获取练习列表成功',
        result
      });

    } catch (error: any) {
      logger.error(`获取练习列表失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'GET_ALL_EXERCISES_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 获取单个练习详情
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回练习详情
   */
  async getExerciseById(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const result = await exerciseService.getExerciseById(exerciseId, userId);

      logger.info(`获取练习详情成功: ${result.data._id}`);
      return res.json({ 
        message: '获取练习详情成功',
        result
      });

    } catch (error: any) {
      logger.error(`获取练习详情失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'GET_EXERCISE_BY_ID_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 更新练习
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的exercise对象
   */
  async updateExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const exercise = req.body;
      const result = await exerciseService.updateExercise(exerciseId, exercise);

      logger.info(`更新练习成功: ${result.updatedExercise._id}`);
      return res.json({ 
        message: '更新练习成功',
        result
      });
    } catch (error: any) {
      logger.error(`更新练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'UPDATE_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 删除练习
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回成功与否的boolean
   */
  async deleteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const result = await exerciseService.deleteExercise(exerciseId);

      logger.info(`删除练习成功: ${exerciseId}`);
      return res.json({ 
        message: '删除练习成功',
        result
      });
    } catch (error: any) {
      logger.error(`删除练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'DELETE_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 获取音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回音频
   */
  async getAudio(req: Request, res: Response) {
    try {
      const { key } = req.query;
    
      await exerciseService.streamAudio(key as string, res);
      // logger.info(`获取音频成功: ${key}`);
      // return res.status(200).json({ 
      //   message: '音频获取成功',
      //   result
      // });
    } catch (error: any) {
      if (!res.headersSent) {
        logger.error(`获取音频失败: ${error}`);
        return res.status(500).json({
          code: 'GET_AUDIO_FAILED',
          message: `音频获取失败: ${error.message}`
        });
      }
    }
  }

//-----------------------------------------------学习状态-----------------------------------------------
  /**
   * 获取学习状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回已学/未学的boolean
   */
  async getLearningStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exeLearnService.checkStatus(userId, exerciseId);
    
      logger.info(`获取学习状态成功: ${status}`);
      return res.json({ 
        message: '获取学习状态成功',
        status: {
          isLearned: status
        }
      });
    } catch (error: any) {
      logger.error(`获取学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'GET_LEARNING_STATUS_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 标为已学
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isLearned: boolean}
   */
  async learnExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exeLearnService.createStatus(userId, exerciseId);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return res.json({ 
        message: '更新学习状态成功',
        status
      });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'LEARN_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 标为未学
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isLearned: boolean}
   */
  async unlearnExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exeLearnService.deleteStatus(userId, exerciseId);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return res.json({ 
        message: '更新学习状态成功',
        status
      });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'UNLEARN_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

//-----------------------------------------------收藏状态-----------------------------------------------
  /**
   * 获取练习题收藏状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回收藏状态的boolean
   */
  async getFavoriteExerciseStatus(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      const userId = req.user._id.toString();
      const status = await exeFavService.checkFavStatusByExeId(userId, exerciseId);
  
      logger.info(`获取练习题收藏状态成功: {${exerciseId}: ${status}}`);
      return res.json({ 
        message: '获取练习题收藏状态成功',
        status: {
          isFavorite: status
        }
      });
    } catch (error: any) {
      logger.error(`获取练习题收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'GET_FAVORITE_EXERCISE_STATUS_FAILED',
        message: error.message
      });
    }
  } 

  /**
   * 获取单段音频收藏状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回收藏状态的boolean
   */
  async getFavoriteAudioStatus(req: Request, res: Response) {
    try {
      const audioId = req.params.audioId;
      const userId = req.user._id.toString();
      const status = await exeFavService.checkFavStatusByAudioId(userId, audioId);
  
      logger.info(`获取音频收藏状态成功: {${audioId}: ${status}}`);
      return res.json({ 
        message: '获取音频收藏状态成功',
        status: {
          isFavorite: status
        }
      });
    } catch (error: any) {
      logger.error(`获取音频收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'GET_FAVORITE_AUDIO_STATUS_FAILED',
        message: error.message
      });
    }
  } 

  /**
   * 收藏练习题
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isFavorite: boolean}
   */
  async favoriteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exeFavService.updateItemFavorites(userId, exerciseId, 'Exercise', true);

      logger.info(`收藏练习成功: {${exerciseId}: ${status.isFavorite}}`);
      return res.json({ 
        message: '收藏练习成功',
        status
      });
    } catch (error: any) {
      logger.error(`收藏练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'FAVORITE_EXERCISE_FAILED',
        message: error.message
      });
    }
  }
  /**
   * 收藏单段语音
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isFavorite: boolean}
   */
  async favoriteAudio(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      const audioId = req.params.audioId;
      const userId = req.user._id.toString();
      const status = await exeFavService.updateItemFavorites(userId, audioId, 'Audio', true);

      logger.info(`收藏单段音频成功: {${audioId}: ${status.isFavorite}}`);
      return res.json({ 
        message: '收藏音频成功',
        status
      });
    } catch (error: any) {
      logger.error(`收藏单段音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'FAVORITE_AUDIO_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 取消收藏练习
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isFavorite: boolean}
   */
  async unfavoriteExercise(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const userId = req.user._id.toString();
      const status = await exeFavService.updateItemFavorites(userId, exerciseId, 'Exercise', false);
  
      logger.info(`取消收藏练习成功: {${exerciseId}: ${status.isFavorite}}`);
      return res.json({ 
        message: '取消收藏练习成功',
        status
      });
    } catch (error: any) {
      logger.error(`取消收藏练习失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'UNFAVORITE_EXERCISE_FAILED',
        message: error.message
      });
    }
  }

  /**
   * 取消收藏单段音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的{isFavorite: boolean}
   */
  async unfavoriteAudio(req: Request, res: Response) {
    try {
      const exerciseId = req.params.exerciseId;
      const audioId = req.params.audioId;
      const userId = req.user._id.toString();
      const status = await exeFavService.updateItemFavorites(userId, audioId, 'Audio', false);
  
      logger.info(`取消收藏音频成功: {${audioId}: ${status.isFavorite}}`);
      return res.json({ 
        message: '取消收藏音频成功',
        status
      });
    } catch (error: any) {
      logger.error(`取消收藏音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ 
        code: 'UNFAVORITE_AUDIO_FAILED',
        message: error.message
      });
    }
  }
}

export const exerciseController = new ExerciseController();