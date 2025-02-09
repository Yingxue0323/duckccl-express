import Exercise, { IExercise } from '../models/Exercise';
import { exeLearnService } from './exeLearnService';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
import { Category, ExerciseSource} from '../utils/constants';
import { getSignedUrl } from '../utils/s3';

class ExerciseService {

  /**
   * 创建新的练习 - 仅管理员使用，不做返回格式处理
   * @param {any} data - 练习对象，包含练习的fulltitle, source, isVIPOnly, intro, dialogs
   * @returns {Promise<any>} 返回创建后的练习对象
   */
  async createExercise(data: any): Promise<any> {
    return await Exercise.create({data});
  }

  // async parseExerciseTitle(fullTitle: string) {
  //   const match = fullTitle.match(/^(\w+)\s+[A-Z](\d+)\.(.+)$/);
  //   if (!match) {
  //     throw new Error(
  //       '标题格式不正确。应为：类别 字母数字.标题' +
  //       '例如：Business B001.Seafood Export'
  //     );
  //   }

  //   return {
  //     category: match[1],           // "Business"
  //     seq: match[2],               // "001"
  //     title: match[3].trim()       // "Seafood Export"
  //   };
  // }

  /**
   * 获取所有练习
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回练习总数、已学数量、收藏数量和题目简要信息列表
   */
  async getAllExercises(userId: string): Promise<{exerciseCount: number, learnedCount: number, 
    favoriteCount: number, isUserVIP: boolean, exercises: { _id: string; seq: string; title: string; isVIPOnly: boolean; 
      category: Category; source: ExerciseSource; isLearned: boolean; isFavorite: boolean; }[]}> {
    if (!userId) {
      throw new Error('User is required');
    }
    
    // 并行异步
    const [exercises, learnedList, favoritesList, isUserVIP] = await Promise.all([
      Exercise.find()
        .sort({ seq: 1 })
        .select('_id seq title category source isVIPOnly')
        .lean(),
      exeLearnService.getAllLearnedExercises(userId), // 返回已学的exerciseId列表
      exeFavService.getAllFavoriteExercises(userId), // 返回收藏的exerciseId列表
      userService.checkVIPStatus(userId) // 用户是否为VIP
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
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回练习详情
   */
  async getExerciseById(exerciseId: string, userId: string): Promise<{message: string, data: {
    _id: string; seq: string; title: string; category: Category; source: ExerciseSource; isVIPOnly: boolean; 
    isUserVIP: boolean; isLearned: boolean; isFavorite: boolean; intro?: any; dialogs?: any; }}> {
    if (!exerciseId || !userId) {
      throw new Error('Exercise ID and User ID are required');
    }

    const isUserVIP = await userService.checkVIPStatus(userId);
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    const [signedIntro, signedDialogs, isLearned, isFavorite] = await Promise.all([
      { ...exercise.intro, url: await getSignedUrl(exercise.intro.url) }, // 获取预签名后的intro
      Promise.all(exercise.dialogs.map(async dialog => ({
        ...dialog,
        url: await getSignedUrl(dialog.url),
        trans_url: dialog.trans_url ? await getSignedUrl(dialog.trans_url) : undefined
      }))), // 获取预签名后的dialogs
      exeLearnService.checkStatus(userId, exerciseId), // 已学/未学，返回boolean
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
          isLearned: isLearned,
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
        isLearned: isLearned,
        isFavorite: isFavorite,
        intro: signedIntro,
        dialogs: signedDialogs
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
}

export const exerciseService = new ExerciseService(); 