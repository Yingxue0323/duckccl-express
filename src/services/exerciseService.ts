import Exercise, { IExercise } from '../models/Exercise';
import { audioService } from './audioService';
import { exeLearnService } from './exeLearnService';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
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
   * 获取菜单项目
   * @returns {Promise<any>} 返回菜单项目列表
   */
  async getMenu(): Promise<{categories: string[], sources: string[], learningStatus: string[]}> {
    return {
      categories: ['BUSINESS', 'COMMUNITY', 'EDUCATION', 'EMPLOYMENT', 'FINANCIAL', 'HOUSING', 
        'IMMIGRATION', 'INSURANCE', 'LEGAL', 'MEDICAL', 'SOCIAL_WELFARE', 'TOURISM'],
      sources: ['QUESTION_BANK', 'EXAM_RECALL'],
      learningStatus: ['LEARNED', 'UNLEARNED']
    };
  }

  /**
   * 创建新的练习 - 仅管理员使用，不做返回格式处理
   * @param {any} data - 练习对象，包含练习的fulltitle, source, isVIPOnly, 并单独创建dialogs
   * @returns {Promise<IExercise>} 返回创建后的练习对象
   */
  async createExercise(data: any): Promise<IExercise> {
    const exercise = await Exercise.create({
      seq: data.seq,
      title: data.title,
      category: data.category,
      source: data.source,
      isVIPOnly: data.isVIPOnly
    })
    await exercise.save();
    return exercise;
  }

  /**
   * 获取所有练习
   * @param {string} openId - 用户ID
   * @param {number} page - 页码
   * @param {number} page_size - 每页数量
   * @param {string[]} category - 分类
   * @param {string} source - 来源
   * @param {string} learning_status - 学习状态
   * @returns {Promise<any>} 返回练习总数、已学数量、收藏数量和题目简要信息列表
   */
  async getAllExercisesByCat(openId: string, page: number = 1, page_size: number = 25, 
   category?: string[], source?: string, learning_status?: string, favorite?: boolean): Promise<any> {
    if (!openId) throw new Error('User is required');
    
    // 页数处理
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 25;
    const skip = (page - 1) * page_size; // 计算跳过的记录数

    // 参数处理
    const query: any = {};
    if (category) query.category = { $in: category };
    if (source) query.source = source;

    // 1. 获取筛选后的练习们详情，所有已学、收藏列表，用户VIP状态
    const [exercises, learnedList, favoritesList, isUserVIP] = await Promise.all([
      Exercise.find(query)
        .sort({ seq: 1 })
        .skip(skip)
        .limit(page_size)
        .select('_id seq title category source isVIPOnly')
        .lean(),
      exeLearnService.getAllLearnedExercises(openId), // 返回已学的exerciseId列表
      exeFavService.getAllFavoriteExercises(openId), // 返回收藏的exerciseId列表
      userService.checkVIPStatus(openId) // 用户是否为VIP
    ]);
    const learnedSet = new Set(learnedList.ids);
    const favoriteSet = new Set(favoritesList.ids);

    let filteredExercises = exercises;
    // 3. 筛选收藏/不限制的练习，user profile -> favorite exercises
    if (favorite) {
      filteredExercises = filteredExercises.filter((exercise: any) => favoriteSet.has(exercise._id.toString()));
    }

    // 4. 筛选已学/未学/不限制的练习
    if (learning_status === 'LEARNED') {
      filteredExercises = exercises.filter((exercise: any) => learnedSet.has(exercise._id.toString()));
    } else if (learning_status === 'UNLEARNED') {
      filteredExercises = exercises.filter((exercise: any) => !learnedSet.has(exercise._id.toString()));
    }

    const exerciseList = filteredExercises.map((exercise: any) => {
      const exerciseId = exercise._id.toString();
      if ( !isUserVIP && exercise.isVIPOnly ) {
        return {  // 不允许展示的不显示学习收藏细节
          ...exercise,
          can_show: false
        };
      }
      return {
        ...exercise,
        can_show: true,
        is_exe_learned: learnedSet.has(exerciseId),
        is_exe_favorite: favoriteSet.has(exerciseId)
      };
    });

    // 5. 最终返回带统计值的
    return {
      current_page: page,
      total_pages: Math.ceil(filteredExercises.length / page_size),
      exercise_count: filteredExercises.length,
      learned_count: learnedList.count,
      favorite_count: favoritesList.count,
      is_user_vip: isUserVIP,
      exercises: exerciseList,
    };
  }

  /**
   * 获取单个练习详情
   * @param {string} exerciseId - 练习ID
   * @param {string} openId - 用户ID
   * @returns {Promise<any>} 返回练习详情
   */
  async getExerciseById(exerciseId: string, openId: string): Promise<any> {
    if (!exerciseId || !openId) throw new Error('Exercise ID and User ID are required');

    // 1. 检查是否允许展示，如果不允许，则直接返回
    // const isUserVIP = await userService.checkVIPStatus(openId);
    const exercise = await Exercise.findById(exerciseId)
      .select('seq title category source')
      .lean();
    if (!exercise) throw new Error('Exercise not found');
    // if (exercise.isVIPOnly && !isUserVIP){
    //   return {  // details仍然展示，但是不寻找对应audios，直接返回
    //     ...exercise,
    //     // can_show: false
    //   };
    // }

    // 2. 允许展示，则寻找对应状态和该练习包含的audios
    const [isExeFavorite, audios] = await Promise.all([
      // exeLearnService.checkLearningStatus(openId, exerciseId),
      exeFavService.checkFavStatus(openId, exerciseId),
      audioService.getAudiosByExerciseId(openId, exerciseId)
    ]);

    return {
      // is_exe_learned: isExeLearned,
      is_exe_favorite: isExeFavorite,
      // can_show: true,
      ...exercise,
      audios: audios
    };
  }

  /**
   * 更新练习 - 仅管理员使用，不做返回格式处理
   * @param {string} exerciseId - 练习ID
   * @param {any} data - seq, title, intro, dialogs, category, source, isVIPOnly
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
}

export const exerciseService = new ExerciseService(); 