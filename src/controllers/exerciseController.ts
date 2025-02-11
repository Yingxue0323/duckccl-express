import { Request } from '../types/express';
import { Response } from 'express';
import { exerciseService } from '../services/exerciseService';
import { exeFavService } from '../services/exeFavService';
import { exeLearnService } from '../services/exeLearnService';
import logger from '../utils/logger';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';

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
      const data = req.body;
      const result = await exerciseService.createExercise(data);

      logger.info(`创建练习成功: ${result.exercise._id}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`创建练习失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.CREATE_EXERCISE_FAILED, error.message);
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
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 25;
      const result = await exerciseService.getAllExercises(req.user.openId, page, pageSize);

      logger.info(`获取练习列表成功: ${result.exerciseCount}个练习, 当前页: ${page}, 每页: ${pageSize}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取练习列表失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_ALL_EXERCISES_FAILED, error.message);
    }
  }

  /**
   * 获取分类练习列表
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回分类练习列表
   */
  async getExerciseByCategories(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const openId = req.user.openId;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 25;
      const result = await exerciseService.getExerciseByCategories(openId, category, page, pageSize);

      logger.info(`获取分类练习列表成功: ${category}分类, ${result.exerciseCount}个练习, 当前页: ${page}, 每页: ${pageSize}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`获取分类练习列表失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_EXERCISE_BY_CATEGORIES_FAILED, error.message);
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
      const openId = req.user.openId;
      const result = await exerciseService.getExerciseById(exerciseId, openId);

      logger.info(`获取练习详情成功: ${result.exercise._id}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取练习详情失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_EXERCISE_BY_ID_FAILED, error.message);
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
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`更新练习失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_EXERCISE_FAILED, error.message);
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
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`删除练习失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.DELETE_EXERCISE_FAILED, error.message);
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

    } catch (error: any) {
      if (!res.headersSent) {
        logger.error(`获取音频失败: ${error}`);
        return ErrorHandler(res, ResponseCode.GET_AUDIO_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeLearnService.checkStatus(openId, exerciseId);
    
      logger.info(`获取学习状态成功: ${status}`);
      return SuccessHandler(res, { isLearned: status });
    } catch (error: any) {
      logger.error(`获取学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_EXE_LEARNING_STATUS_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeLearnService.createStatus(openId, exerciseId);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.LEARN_EXERCISE_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeLearnService.deleteStatus(openId, exerciseId);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UNLEARN_EXERCISE_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeFavService.checkFavStatusByExeId(openId, exerciseId);
  
      logger.info(`获取练习题收藏状态成功: {${exerciseId}: ${status}}`);
      return SuccessHandler(res, { isFavorite: status });
    } catch (error: any) {
      logger.error(`获取练习题收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_EXE_FAV_STATUS_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeFavService.checkFavStatusByAudioId(openId, audioId);
  
      logger.info(`获取音频收藏状态成功: {${audioId}: ${status}}`);
      return SuccessHandler(res, { isFavorite: status });
    } catch (error: any) {
      logger.error(`获取音频收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_FAVORITE_AUDIO_STATUS_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeFavService.updateItemFavorites(openId, exerciseId, 'Exercise', true);

      logger.info(`收藏练习成功: {${exerciseId}: ${status.isFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`收藏练习失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.FAVORITE_EXERCISE_FAILED, error.message);
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
      const audioId = req.params.id;
      const openId = req.user.openId;
      const status = await exeFavService.updateItemFavorites(openId, audioId, 'Audio', true);

      logger.info(`收藏单段音频成功: {${audioId}: ${status.isFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`收藏单段音频失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.FAVORITE_AUDIO_FAILED, error.message);
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
      const openId = req.user.openId;
      const status = await exeFavService.updateItemFavorites(openId, exerciseId, 'Exercise', false);
  
      logger.info(`取消收藏练习成功: {${exerciseId}: ${status.isFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`取消收藏练习失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UNFAVORITE_EXERCISE_FAILED, error.message);
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
      const audioId = req.params.audioId;
      const openId = req.user.openId;
      const status = await exeFavService.updateItemFavorites(openId, audioId, 'Audio', false);
  
      logger.info(`取消收藏音频成功: {${audioId}: ${status.isFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`取消收藏音频失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UNFAVORITE_AUDIO_FAILED, error.message);
    }
  }
}

export const exerciseController = new ExerciseController();