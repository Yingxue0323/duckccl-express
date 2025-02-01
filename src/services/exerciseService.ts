import Exercise, { IExercise } from '../models/Exercise';
import { exeLearnService } from './exeLearnService';
import { exeFavService } from './exeFavService';
import { userService } from './userService';

class ExerciseService {
  // 获取练习列表
  async getAllExercises(userId: string): Promise<any> {
    if (!userId) {
      throw new Error('User is required');
    }
    
    // 并行异步
    const [exercises, learned, favorites] = await Promise.all([
      Exercise.find().sort({ seq: 1 }),
      exeLearnService.getLearnedExercisesList(userId), // 已学/未学，返回已学的exerciseId列表
      exeFavService.getFavoriteExercisesList(userId) // 是否收藏，返回收藏的exerciseId列表
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
      exercises: exerciseList,
    };
  }

  // 获取单个练习详情
  async getExerciseById(exerciseId: string, userId: string): Promise<any> {
    if (!exerciseId || !userId) {
      throw new Error('Exercise ID and User ID are required');
    }

    const isVIP = await userService.checkVIPStatus(userId);

    const [exercise, isLearned, isFavorite] = await Promise.all([
      Exercise.findById(exerciseId).populate('dialogs').populate('intro'),
      exeLearnService.getLearningStatusByExeId(userId, exerciseId), // 已学/未学，返回boolean
      exeFavService.getFavoriteStatusByExeId(userId, exerciseId) // 是否收藏，返回boolean
    ]);

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // 如果是VIP内容但用户不是VIP
    if (exercise.isVIPOnly && !isVIP) {
      return {
        message: 'VIP_REQUIRED',
        data: {
          _id: exercise._id,
          seq: exercise.seq,
          title: exercise.title,
          category: exercise.category,
          source: exercise.source,
          isVIP,
          isLearned,
          isFavorite,
          isVIPOnly: exercise.isVIPOnly,
          intro: exercise.intro,
          dialogs: exercise.dialogs
        }
      }
    }

    return {
      message: 'VIP_SUCCESS',
      data: {
        _id: exercise._id,
        seq: exercise.seq,
        title: exercise.title,
        category: exercise.category,
        source: exercise.source,
        isVIP,
        isLearned,
        isFavorite,
        isVIPOnly: exercise.isVIPOnly,
        intro: exercise.intro,
        dialogs: exercise.dialogs
      }
    };
  }

  // 更新学习状态
  async updateLearningStatus(userId: string, exerciseId: string, isLearned: boolean): Promise<any> {
    return exeLearnService.updateLearningStatus(userId, exerciseId, isLearned);
  }

  // 更新收藏状态
  async updateFavoriteStatus(userId: string, exerciseId: string, isFavorite: boolean): Promise<any> {
    return exeFavService.updateFavoriteStatus(userId, exerciseId, isFavorite);
  }

  //----------------------------------管理员----------------------------------
  // 创建练习
  async createExercise(exercise: IExercise): Promise<any> {
    const newExercise = await Exercise.create(exercise);
    return {
      message: 'CREATE_EXERCISE_SUCCESS',
      exercise: newExercise
    }
  }

  // 更新练习
  async updateExercise(exercise: IExercise): Promise<any> {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exercise._id, 
      exercise, 
      { new: true }
    );
    return {
      message: 'UPDATE_EXERCISE_SUCCESS',
      exercise: updatedExercise
    }
  }

  // 删除练习
  async deleteExercise(exerciseId: string): Promise<any> {
    await Exercise.findByIdAndDelete(exerciseId);
    return {
      message: 'DELETE_EXERCISE_SUCCESS',
      exerciseId: exerciseId
    }
  }
}

export const exerciseService = new ExerciseService(); 