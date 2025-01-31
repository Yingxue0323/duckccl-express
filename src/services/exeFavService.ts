import Exercise from '../models/Exercise';
import ExerciseFavorite from '../models/ExerciseFavorite';
import WordFavorite from '../models/WordFavorite';

class ExeFavService {
  // 新增收藏的练习
  async addFavoriteExercise(userId: string, exerciseId: string) {
    return ExerciseFavorite.create({ userId, exerciseId });
  }

  // 获取所有收藏的itemId列表
  async _getFavoritesByType(userId: string, itemType: string): Promise<string[]> {
    const favoriteList = await ExerciseFavorite.find({
      userId,
      itemType
    })
    .select('itemId')
    .lean();
      
    return favoriteList.map(item => item.itemId.toString());
  }

  // 获取所有收藏的练习题id列表（练习）
  async getFavoriteExercisesList(userId: string): Promise<string[]> {
    return this._getFavoritesByType(userId, 'Exercise');
  }
  // 获取所有收藏的音频id列表 (单条对话)
  async getFavoriteAudiosList(userId: string): Promise<string[]> {
    return this._getFavoritesByType(userId, 'Audio');
  }

  // 获取所有收藏的单词id列表
  async getFavoriteWordsList(userId: string): Promise<string[]> {
    const favoriteList = await WordFavorite.find({
      userId,
    }).select('wordId').lean();
      
    return favoriteList.map(status => status.wordId.toString());
  }

  // 获取单个练习是否收藏
  async getFavoriteStatusByExeId(userId: string, exerciseId: string): Promise<boolean> {
    const favoriteStatus = await ExerciseFavorite.findOne({
      userId,
      exerciseId
    });
    return favoriteStatus ? true : false;
  }

  // 获取单个练习详情
  // async getFavoriteExerciseById(exerciseId: string, userId: string) {
  //   const exercise = await Exercise.findById(exerciseId)
  //     .populate('dialogs');  // 填充对话内容
      
  //   if (!exercise) {
  //     throw new Error('Exercise not found');
  //   }

  //   const learningStatus = await ExerciseLearning.findOne({
  //     userId,
  //     exerciseId
  //   });

  //     return {
  //       ...exercise.toObject(),
  //       isLearned: learningStatus?.isLearned || false
  //     };
  //   }

  //   return exercise;
  // }

  // // 取消收藏
  // async cancelFavoriteExercise(userId: string, exerciseId: string) {
  //   return ExerciseFavorite.findOneAndDelete({ userId, exerciseId });
  // }
}

export const exeFavService = new ExeFavService(); 