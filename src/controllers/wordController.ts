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
 * 获取菜单
 * @param {Request} req - 请求对象
 * @param {Response} res - 响应对象
 * @returns {Promise<any>} 返回菜单列表
 */
  async getMenus(req: Request, res: Response) {
    try {
      const menu = await wordService.getMenus();

      logger.info(`获取菜单成功`);
      return SuccessHandler(res, { menu });
    } catch (error: any) {
      logger.error(`获取菜单失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_MENUS_FAILED, error.message);
    }
  }

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
      const page = req.query.page ? 
        parseInt(req.query.page as string) : 1;
      const page_size = req.query.page_size ? 
        parseInt(req.query.page_size as string) : 25;

      const category = req.query.category 
        ? Array.isArray(req.query.category)
          ? req.query.category.map(cat => String(cat).toUpperCase())
          : [String(req.query.category).toUpperCase()]
        : undefined;
      const learning_status = req.query.learning_status 
        ? String(req.query.learning_status).toUpperCase() 
        : undefined;
      const favorite = req.query.favorite
        ? Boolean(req.query.favorite)
        : undefined;
      const random = req.query.isRandom
        ? Boolean(req.query.random)
        : false;

      const result = await wordService.getAllWordsByCat(req.user.openId, page, page_size, category, learning_status, favorite, random);

      logger.info(`获取单词列表成功: ${result.word_count}个单词, 当前页: ${page}, 每页: ${page_size}`);
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

//----------------------------------------- 学习 -----------------------------------------
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
      const status = await wordLearnService.checkStatus(openId, wordId);
    
      logger.info(`获取学习状态成功: ${status}`);
      return SuccessHandler(res, { isLearned: status });
    } catch (error: any) {
      logger.error(`获取学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_WORD_LEARNING_STATUS_FAILED, error.message);
    }
  }

  /**
   * 根据传入数字标为已掌握/未学/学习中
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的学习状态和正确次数
   */
  async updateLearningStatus(req: Request, res: Response) {
    try {
      const wordId = req.params.id;
      const openId = req.user.openId;
      const correctCount = req.body.correctCount;
      const learningStatus = await wordLearnService.updateLearningStatus(openId, wordId, correctCount);

      logger.info(`更新学习状态成功: ${wordId}`);
      return SuccessHandler(res, { learningStatus });
    } catch (error: any) {
      logger.error(`更新学习状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UPDATE_WORD_LEARNING_STATUS_FAILED, error.message);
    }
  }

//----------------------------------------- 收藏 -----------------------------------------
  /**
   * 获取收藏状态
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回收藏状态的boolean
   */
  async getFavoriteWordStatus(req: Request, res: Response) {
    try {
      const wordId = req.params.wordId;
      const openId = req.user.openId;
      const status = await wordFavService.checkFavStatus(openId, wordId);
  
      logger.info(`获取单词收藏状态成功: {${wordId}: ${status}}`);
      return SuccessHandler(res, { isWordFavorite: status });
    } catch (error: any) {
      logger.error(`获取单词收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.GET_WORD_FAV_STATUS_FAILED, error.message);
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
      const status = await wordFavService.favoriteWord(openId, wordId);

      logger.info(`收藏单词成功: {${wordId}: ${status.isWordFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`收藏单词失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.FAVORITE_WORD_FAILED, error.message);
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
      const status = await wordFavService.unfavoriteWord(openId, wordId);
  
      logger.info(`取消收藏单词成功: {${wordId}: ${status.isWordFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`取消收藏单词失败: ${JSON.stringify({ error: error.message })}`);
      return ErrorHandler(res, ResponseCode.UNFAVORITE_WORD_FAILED, error.message);
    }
  }
}

export const wordController = new WordController();