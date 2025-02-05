import { Request, Response } from 'express';
import { audioService } from '../services/audioService';
import logger from '../utils/logger';

class AudioController {
  // 创建音频
  async createAudio(req: Request, res: Response) {
    try {
      const audio = await audioService.createAudio(req.body);
      return res.json(audio);
    } catch (error: any) {
      logger.error(`创建音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '创建音频失败' });
    }
  }

  // 获取所有音频列表
  async getAllAudios(req: Request, res: Response) {
    try {
      const audios = await audioService.getAllAudios();
      logger.info(`获取所有音频成功: ${audios.length}`);
      return res.json(audios);

    } catch (error: any) {
      logger.error(`获取所有音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '获取所有音频失败' });
    }
  }

  // 获取单个音频详情
  async getAudioById(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const userId = req.user.id;
      const audio = await audioService.getAudioById(audioId, userId);

      logger.info(`获取音频成功: ${audioId}`);
      return res.json(audio);
    } catch (error: any) {
      logger.error(`获取音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '获取音频失败' });
    }
  }

  // 更新音频
  async updateAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const audio = await audioService.updateAudio(audioId, req.body);

      logger.info(`更新音频成功: ${audioId}`);
      return res.json(audio);
    } catch (error: any) {
      logger.error(`更新音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '更新音频失败' });
    }
  } 
  
  // 删除音频
  async deleteAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const audio = await audioService.deleteAudio(audioId);

      logger.info(`删除音频成功: ${audioId}`);
      return res.json({ message: '删除音频成功' });
    } catch (error: any) {
      logger.error(`删除音频失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '删除音频失败' });
    }
  }

  // 获取收藏状态
  async getFavoriteStatus(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const userId = req.user._id.toString();
      const result = await audioService.getFavoriteStatus(userId, audioId);
  
      logger.info(`获取收藏状态成功: ${result.isFavorite}`);
      return res.json(result);
    } catch (error: any) {
      logger.error(`获取收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  } 

  // 收藏音频
  async favoriteAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const userId = req.user._id.toString();
      const status = await audioService.updateFavoriteStatus(userId, audioId, true);

      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }

  // 取消收藏音频
  async unfavoriteAudio(req: Request, res: Response) {
    try {
      const audioId = req.params.id;
      const userId = req.user._id.toString();
      const status = await audioService.updateFavoriteStatus(userId, audioId, false);
  
      logger.info(`更新收藏状态成功: ${status.isFavorite}`);
      return res.json(status);
    } catch (error: any) {
      logger.error(`更新收藏状态失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ message: error.message });
    }
  }
}
export const audioController = new AudioController();