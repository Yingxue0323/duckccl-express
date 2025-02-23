import { Request } from '../types/express';
import { Response } from 'express';
import { wordService } from '../services/wordService';
import { wordFavService } from '../services/wordFavService';
import { wordLearnService } from '../services/wordLearnService';
import logger from '../utils/logger';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';

class WordController {
  /**
   * 创建单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回创建后的word对象
   */
  async createWord(req: Request, res: Response) {
    try { 
      const word = req.body;
      const result = await wordService.createWord(word);

      logger.info(`创建单词成功: ${result._id}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`创建单词失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.CREATE_WORD_FAILED, error.message);
    }
  }

  /**
   * 获取所有单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回所有单词的列表
   */
  async getAllWords(req: Request, res: Response) {
    try {
      const result = await wordService.getAllWords();

      logger.info(`获取单词列表成功: ${result.length}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取单词列表失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_ALL_WORDS_FAILED, error.message);
    }
  }

  /**
   * 获取单个单词详情
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回单个单词的详情
   */
  async getWordById(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const result = await wordService.getWordById(wordId, openId);

      logger.info(`获取单词详情成功: ${result.data._id}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取单词详情失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_WORD_BY_ID_FAILED, error.message);
    }
  }

  /**
   * 更新单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的word对象
   */
  async updateWord(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const word = req.body;
      const result = await wordService.updateWord(wordId, word);

      logger.info(`更新单词成功: ${wordId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`更新单词失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_WORD_FAILED, error.message);
    }
  }

  /**
   * 删除单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回成功与否的boolean
   */
  async deleteWord(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const result = await wordService.deleteWord(wordId);

      logger.info(`删除单词成功: ${wordId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`删除单词失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.DELETE_WORD_FAILED, error.message);
    }
  }

  /**
   * 获取学习状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回学习状态的boolean
   */
  async getLearningStatus(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const result = await wordFavService.getLearningStatus(openId, wordId);
  
      logger.info(`获取学习状态成功: ${result.isLearned}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`获取学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_WORD_LEARNING_STATUS_FAILED, error.message);
    }
  }

  /**
   * 获取收藏状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回收藏状态的boolean
   */
  async getFavoriteStatus(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const result = await wordFavService.checkFavStatusByWordId(openId, wordId);
  
      logger.info(`获取收藏状态成功: ${result}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`获取收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_FAVORITE_WORD_STATUS_FAILED, error.message);
    }
  } 

  /**
   * 标为已掌握/未学/学习中
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的学习状态的boolean
   */
  async updateLearningStatus(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const learningStatus = req.body.learningStatus;
      const status = await wordLearnService.updateLearningStatus(openId, wordId, learningStatus);

      logger.info(`更新学习状态成功: ${status.isLearned}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_LEARNING_STATUS_FAILED, error.message);
    }
  }

  /**
   * 收藏单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的收藏状态的boolean
   */
  async favoriteWord(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const status = await wordFavService.addFavoriteWord(openId, wordId);

      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_FAVORITE_STATUS_FAILED, error.message);
    }
  }

  /**
   * 取消收藏单词
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的收藏状态的boolean
   */
  async unfavoriteWord(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const status = await wordFavService.deleteFavoriteWord(openId, wordId);
  
      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_FAVORITE_STATUS_FAILED, error.message);
    }
  }
}

export const wordController = new WordController();