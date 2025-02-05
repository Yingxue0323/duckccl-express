import Exercise, { IExercise } from '../models/Exercise';
import { exeLearnService } from './exeLearnService';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
import { introService } from './introService';
import { dialogService } from './dialogService';
import { Category, ExerciseSource } from '../utils/constants';
import mongoose from 'mongoose';
import Dialog from '../models/Dialog';

class ExerciseService {

  /**
   * 创建新的练习 - 仅管理员使用，不做返回格式处理
   * @param {any} exercise - 练习对象，包含练习的所有必要7信息(seq, title, introId, dialogIds, category, source, isVIPOnly)
   * @returns {Promise<any>} 返回创建后的练习对象
   */
  async createExercise(exercise: any): Promise<{exercise: IExercise}> {
    const newExercise = await Exercise.create(exercise);
    return { exercise: newExercise as IExercise }
  }

  /**
   * 获取所有练习
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回练习总数、已学数量、收藏数量和题目简要信息列表
   */
  async getAllExercises(userId: string): Promise<{exerciseCount: number, learnedCount: number, 
    favoriteCount: number, isUserVIP: boolean, exercises: { _id: string; seq: number; title: string; isVIPOnly: boolean; 
      category: Category; source: ExerciseSource; isLearned: boolean; isFavorite: boolean; }[]}> {
    if (!userId) {
      throw new Error('User is required');
    }
    
    // 并行异步
    const [exercises, learned, favorites, isUserVIP] = await Promise.all([
      Exercise.find().sort({ seq: 1 }),
      exeLearnService.getLearnedExercisesList(userId), // 已学/未学，返回已学的exerciseId列表
      exeFavService.getFavoriteExercisesList(userId), // 是否收藏，返回收藏的exerciseId列表
      userService.checkVIPStatus(userId) // 用户是否为VIP
    ]);

    // 转换为Map，方便查询
    const learnedMap = new Map(
      learned.map(itemId => [itemId, true])
    );
    const favoriteMap = new Map(
      favorites.map(itemId => [itemId, true])
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
      learnedCount: learned.length,
      favoriteCount: favorites.length,
      isUserVIP: isUserVIP,
      exercises: exerciseList,
    };
  }

  /**
   * 获取单个练习详情
   * @param {string} exerciseId - 练习ID
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回练习详情
   */
  async getExerciseById(exerciseId: string, userId: string): Promise<{message: string, data: {
    _id: string; seq: number; title: string; category: Category; source: ExerciseSource; isVIPOnly: boolean; 
    isUserVIP: boolean; isLearned: boolean; isFavorite: boolean; intro?: any; dialogs?: any; }}> {
    if (!exerciseId || !userId) {
      throw new Error('Exercise ID and User ID are required');
    }

    const isUserVIP = await userService.checkVIPStatus(userId);
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    const [intro, dialogs, isLearned, isFavorite] = await Promise.all([
      introService.getIntroById(exercise.introId.toString()), // 获取intro
      Promise.all(exercise.dialogIds.map(dialogId => 
        dialogService.getDialogById(dialogId.toString(), userId)
      )), // 获取dialogs
      exeLearnService.checkLearningStatusByExeId(userId, exerciseId), // 已学/未学，返回boolean
      exeFavService.checkFavStatusByExeId(userId, exerciseId) // 是否收藏，返回boolean
    ]);

    // 如果是VIP内容但用户不是VIP
    if (exercise.isVIPOnly && !isUserVIP) {
      return {
        message: 'VIP_REQUIRED',
        data: {
          _id: exerciseId,
          seq: exercise.seq,
          title: exercise.title,
          category: exercise.category,
          source: exercise.source,
          isVIPOnly: exercise.isVIPOnly,
          isUserVIP: isUserVIP,
          isLearned: isLearned.isLearned,
          isFavorite: isFavorite
        }
      }
    }

    return {
      message: 'VIP_SUCCESS',
      data: {
        _id: exerciseId,
        seq: exercise.seq,
        title: exercise.title,
        category: exercise.category,
        source: exercise.source,
        isVIPOnly: exercise.isVIPOnly,
        isUserVIP: isUserVIP,
        isLearned: isLearned.isLearned,
        isFavorite: isFavorite,
        intro: intro,
        dialogs: dialogs
      }
    };
  }

  /**
   * 更新练习 - 仅管理员使用，不做返回格式处理
   * @param {string} exerciseId - 练习ID
   * @param {any} exercise - 只可修改7信息(seq, title, introId, dialogIds, category, source, isVIPOnly)
   * @returns {Promise<any>} 返回更新后的练习对象
   */
  async updateExercise(exerciseId: string, exercise: any): Promise<{updatedExercise: IExercise}> {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId, 
      exercise, 
      { new: true }
    );
    return { updatedExercise: updatedExercise as IExercise }
  }

  /**
   * 删除练习 - 仅管理员使用，不做返回格式处理
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回删除后的练习ID
   */
  async deleteExercise(exerciseId: string): Promise<{exerciseId: string}> {
    await Exercise.findByIdAndDelete(exerciseId);
    return { exerciseId: exerciseId }
  }

  /**
   * 获取学习状态
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回学习状态
   */
  async getLearningStatus(userId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    return await exeLearnService.checkLearningStatusByExeId(userId, exerciseId);
  }

  /**
   * 更新学习状态
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @param {boolean} isLearned - 学习状态
   * @returns {Promise<any>} 返回更新后的学习状态
   */
  async updateLearningStatus(userId: string, exerciseId: string, isLearned: boolean): Promise<{isLearned: boolean}> {
    return await exeLearnService.updateLearningStatus(userId, exerciseId, isLearned);
  }

  /**
   * 获取收藏状态
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回收藏状态
   */
  async getFavoriteStatus(userId: string, exerciseId: string): Promise<{isFavorite: boolean}> {
    const isFavorite = await exeFavService.checkFavStatusByExeId(userId, exerciseId);
    return { isFavorite };
  }

  /**
   * 更新收藏状态
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @param {boolean} isFavorite - 收藏状态
   * @returns {Promise<any>} 返回更新后的收藏状态
   */
  async updateFavoriteStatus(userId: string, exerciseId: string, itemType: string, isFavorite: boolean): Promise<{isFavorite: boolean}> {
    return await exeFavService.updateFavoriteStatus(userId, exerciseId, itemType, isFavorite);
  }
}

export const exerciseService = new ExerciseService(); 