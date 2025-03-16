import { Request } from '../types/express';
import { Response } from 'express';
import { audioService } from '../services/audioService';
import logger from '../utils/logger';
import { SuccessHandler, ErrorHandler } from '../utils/response';
import { ResponseCode } from '../utils/constants';
import { audioFavService } from '../services/audioFavService';
import { ParamError } from '../utils/errors';

class AudioController {
//-----------------------------------------------基础CURD-----------------------------------------------
  /**
   * 创建音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回创建后的audio对象
   */
  async createAudio(req: Request, res: Response) {
    try { 
      const data = req.body;
      const result = await audioService.createAudio(data);

      logger.info(`创建音频成功: ${result.audio._id}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`创建音频失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.CREATE_AUDIO_FAILED, error.message);
    }
  }

  /**
   * 获取所有音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回音频列表
   */
  async getAllAudios(req: Request, res: Response) {
    try {
      const page = req.query.page ? 
        parseInt(req.query.page as string) : 1;
      const page_size = req.query.page_size ? 
        parseInt(req.query.page_size as string) : 25;

      const favorite = req.query.favorite ? 
        Boolean(req.query.favorite) : undefined;

      const result = await audioService.getAllAudios(req.user.openId, page, page_size, favorite);

      logger.info(`获取音频列表成功: ${result.audio_count}个音频, 当前页: ${page}, 每页: ${page_size}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取音频列表失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_ALL_AUDIOS_FAILED, error.message);
    }
  }

  /**
   * 获取一个练习中的所有音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回音频列表
   */
  async getAudioByExerciseId(req: Request, res: Response) {
    try {
      const exerciseId = req.params.id;
      const openId = req.user.openId;
      const audios = await audioService.getAudiosByExerciseId(openId, exerciseId);

      logger.info(`获取音频列表成功: ${audios.length}个音频`);
      return SuccessHandler(res, { audios });
    } catch (error: any) {
      logger.error(`获取音频列表失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_ALL_AUDIOS_FAILED, error.message);
    }
  }
  /**
   * 获取单个音频详情
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回音频详情
   */
  async getAudioById(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const openId = req.user.openId;
      const result = await audioService.getAudioById(audioId, openId);

      logger.info(`获取音频详情成功: ${result.audio._id}`);
      return SuccessHandler(res, { result });

    } catch (error: any) {
      logger.error(`获取音频详情失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_AUDIO_FAILED, error.message);
    }
  }

  /**
   * 更新音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回更新后的audio对象
   */
  async updateAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const audio = req.body;
      const result = await audioService.updateAudio(audioId, audio);

      logger.info(`更新音频成功: ${result.updatedAudio._id}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`更新音频失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.UPDATE_AUDIO_FAILED, error.message);
    }
  }

  /**
   * 删除音频
   * @param {Request} req - 请求对象
   * @param {Response} res - 响应对象
   * @returns {Promise<any>} 返回成功与否的boolean
   */
  async deleteAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const result = await audioService.deleteAudio(audioId);

      logger.info(`删除音频成功: ${audioId}`);
      return SuccessHandler(res, { result });
    } catch (error: any) {
      logger.error(`删除音频失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.DELETE_AUDIO_FAILED, error.message);
    }
  }

//-----------------------------------------------收藏状态-----------------------------------------------
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
      const status = await audioFavService.checkFavStatusByAudioId(openId, audioId);
  
      logger.info(`获取音频收藏状态成功: {${audioId}: ${status}}`);
      return SuccessHandler(res, { isAudioFavorite: status });
    } catch (error: any) {
      logger.error(`获取音频收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.GET_FAVORITE_AUDIO_STATUS_FAILED, error.message);
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
      const status = await audioFavService.favoriteAudio(openId, audioId);

      logger.info(`收藏单段音频成功: {${audioId}: ${status.isAudioFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`收藏单段音频失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.FAVORITE_AUDIO_FAILED, error.message);
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
      const status = await audioFavService.unfavoriteAudio(openId, audioId);
  
      logger.info(`取消收藏音频成功: {${audioId}: ${status.isAudioFavorite}}`);
      return SuccessHandler(res, { status });
    } catch (error: any) {
      logger.error(`取消收藏音频失败: ${JSON.stringify({ error: error.message })}`);
      if (error instanceof ParamError) return ErrorHandler(res, error.code, error.message);
      return ErrorHandler(res, ResponseCode.UNFAVORITE_AUDIO_FAILED, error.message);
    }
  }
}

export const audioController = new AudioController();