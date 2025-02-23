import User from '../models/User';
import WordFavorite from '../models/WordFavorite';
import ExerciseFavorite from '../models/ExerciseFavorite';

export const favoriteService = {
  // 收藏单词
  async addWordFavorite(userId: string, wordId: string) {
    // 1. 创建收藏记录
    await WordFavorite.create({
      userId,
      wordId
    });

    // 2. 更新用户收藏计数
    await User.findByIdAndUpdate(userId, {
      $inc: { 'favoriteCount.word': 1 }
    });
  },

  // 取消收藏单词
  async removeWordFavorite(userId: string, wordId: string) {
    await WordFavorite.findOneAndDelete({
      userId,
      wordId
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { 'favoriteCount.word': -1 }
    });
  },

  // 收藏练习或音频
  async addExerciseFavorite(userId: string, itemId: string, itemType: 'Exercise' | 'Audio') {
    await ExerciseFavorite.create({
      userId,
      itemId,
      itemType
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { 'favoriteCount.exercise': 1 }
    });
  },

  // 取消收藏练习或音频
  async removeExerciseFavorite(userId: string, itemId: string) {
    await ExerciseFavorite.findOneAndDelete({
      userId,
      itemId
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { 'favoriteCount.exercise': -1 }
    });
  },

  // 获取用户收藏的单词（分页）
  async getUserWordFavorites(userId: string, page: number, pageSize: number) {
    return WordFavorite.find({ userId })
      .sort('-addedAt')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('wordId');
  },

  // 获取用户收藏的练习和音频（分页）
  async getUserExerciseFavorites(userId: string, page: number, pageSize: number) {
    return ExerciseFavorite.find({ userId })
      .sort('-createdAt')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({
        path: 'itemId',
        // 根据 itemType 动态选择填充的字段
        select: 'title intro dialogs url duration translations'
      });
  },

  // 获取特定类型的收藏
  async getUserFavoritesByType(userId: string, itemType: 'Exercise' | 'Audio', page: number, pageSize: number) {
    return ExerciseFavorite.find({ userId, itemType })
      .sort('-createdAt')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('itemId');
  }
}; 