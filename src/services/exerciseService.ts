import Exercise, { IExercise } from '../models/Exercise';
import { exeLearnService } from './exeLearnService';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
import { Category, ExerciseSource} from '../utils/constants';
import logger from '../utils/logger';
import { Response } from 'express';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { config } from '../configs';

const s3Client = new S3Client({
  region: config.s3.region || 'ap-southeast-2',
  credentials: {
    accessKeyId: config.aws.accessKey || '',
    secretAccessKey: config.aws.secretAccessKey || ''
  }
});

class ExerciseService {

  /**
   * 创建新的练习 - 仅管理员使用，不做返回格式处理
   * @param {any} data - 练习对象，包含练习的fulltitle, source, isVIPOnly, intro, dialogs
   * @returns {Promise<any>} 返回创建后的练习对象
   */
  async createExercise(data: any): Promise<any> {
    const exercise = await Exercise.create({
      seq: data.seq,
      title: data.title,
      category: data.category,
      source: data.source,
      isVIPOnly: data.isVIPOnly,
      intro: data.intro,
      dialogs: data.dialogs});
    const result = await exercise.save();
    return { exercise: result };
  }

  /**
   * 获取所有练习
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回练习总数、已学数量、收藏数量和题目简要信息列表
   */
  async getAllExercises(openId: string): Promise<{exerciseCount: number, learnedCount: number, 
    favoriteCount: number, isUserVIP: boolean, exercises: { _id: string; seq: string; title: string; isVIPOnly: boolean; 
      category: Category; source: ExerciseSource; isLearned: boolean; isFavorite: boolean; }[]}> {
    if (!openId) {
      throw new Error('User is required');
    }
    
    // 并行异步
    const [exercises, learnedList, favoritesList, isUserVIP] = await Promise.all([
      Exercise.find()
        .sort({ seq: 1 })
        .select('_id seq title category source isVIPOnly')
        .lean(),
      exeLearnService.getAllLearnedExercises(openId), // 返回已学的exerciseId列表
      exeFavService.getAllFavoriteExercises(openId), // 返回收藏的exerciseId列表
      userService.checkVIPStatus(openId) // 用户是否为VIP
    ]);

    // 转换为Map，方便查询
    const learnedMap = new Map(
      learnedList.ids.map((itemId: string) => [itemId, true])
    );
    const favoriteMap = new Map(
      favoritesList.ids.map((itemId: string) => [itemId, true]) // 使用 favorites.ids
    );

    const exerciseList = exercises.map((exercise: IExercise) => {
      const exerciseId = exercise._id.toString();
      return {
        _id: exerciseId,
        seq: exercise.seq,
        title: exercise.title,
        isVIPOnly: exercise.isVIPOnly,
        category: exercise.category,
        source: exercise.source,
        isLearned: learnedMap.get(exerciseId) || false,
        isFavorite: favoriteMap.get(exerciseId) || false
      };
    });

    // 返回带统计值的
    return {
      exerciseCount: exercises.length,
      learnedCount: learnedList.count,
      favoriteCount: favoritesList.count,
      isUserVIP: isUserVIP,
      exercises: exerciseList,
    };
  }

  /**
   * 获取单个练习详情
   * @param {string} exerciseId - 练习ID
   * @param {string} openId - 用户ID
   * @returns {Promise<any>} 返回练习详情
   */
  async getExerciseById(exerciseId: string, openId: string): Promise<{vipMsg: string, exercise: any}> {
    if (!exerciseId || !openId) {
      throw new Error('Exercise ID and User ID are required');
    }

    const isUserVIP = await userService.checkVIPStatus(openId);
    const exercise = await Exercise.findById(exerciseId).lean();
    if (!exercise) throw new Error('Exercise not found');

    const isLearned = await exeLearnService.checkStatus(openId, exerciseId);
    const isFavorite = await exeFavService.checkFavStatusByExeId(openId, exerciseId);
    const dialogsWithIds = exercise.dialogs.map((dialog: any) => ({
      ...dialog,
      _id: dialog._id
    }));

    // 如果是VIP内容但用户不是VIP
    if (exercise.isVIPOnly && !isUserVIP) {
      return {
        vipMsg: 'VIP_REQUIRED',
        exercise: {
          _id: exerciseId,
          seq: exercise.seq,
          title: exercise.title,
          category: exercise.category,
          source: exercise.source,
          isVIPOnly: exercise.isVIPOnly,
          isUserVIP: isUserVIP,
          isLearned: isLearned,
          isFavorite: isFavorite
        }
      }
    }

    return {
      vipMsg: 'VIP_SUCCESS',
      exercise: {
        ...exercise,
        isUserVIP: isUserVIP,
        isLearned: isLearned,
        isFavorite: isFavorite,
        intro: exercise.intro,
        dialogs: dialogsWithIds
      }
    };
  }

  /**
   * 更新练习 - 仅管理员使用，不做返回格式处理
   * @param {string} exerciseId - 练习ID
   * @param {any} exercise - seq, title, intro, dialogs, category, source, isVIPOnly
   * @returns {Promise<any>} 返回更新后的练习对象
   */
  async updateExercise(exerciseId: string, data: any): Promise<{updatedExercise: IExercise}> {
    const updatedExercise = await Exercise.findByIdAndUpdate(exerciseId, data);
    if (!updatedExercise) throw new Error('Exercise not found');
    return { updatedExercise }
  }

  /**
   * 删除练习 - 仅管理员使用，不做返回格式处理
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回删除成功与否的boolean
   */
  async deleteExercise(exerciseId: string): Promise<boolean> {
    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);
    if (!deletedExercise) throw new Error('Exercise not found');
    return true;
  }

  /**
   * 获取音频文件并流式传输给前端
   */
  async streamAudio(url: string, res: Response) {
    try {
      logger.info(`开始流式传输音频`);

      // 从 URL 解析出 bucket 和 key
      const s3Url = new URL(url);
      const bucket = s3Url.hostname.split('.')[0];
      const key = decodeURIComponent(s3Url.pathname.substring(1)); // 移除开头的 '/'

      logger.info(`Accessing S3: bucket=${bucket}, key=${key}`);

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
      });

      const s3Response = await s3Client.send(command);
      
      if (!s3Response.Body) {
        throw new Error('No response body from S3');
      }
      
      res.setHeader('Content-Type', s3Response.ContentType || 'audio/mpeg');
      if (s3Response.ContentLength) {
        res.setHeader('Content-Length', s3Response.ContentLength);
      }
      res.setHeader('Accept-Ranges', 'bytes');

      const stream = s3Response.Body as Readable;
      return stream.pipe(res);

    } catch (error: any) {
      logger.error(`流式传输音频失败: ${error}`);
      throw new Error(`音频流式传输失败: ${JSON.stringify({ error: error.message })}`);
    }
  }
}

export const exerciseService = new ExerciseService(); 