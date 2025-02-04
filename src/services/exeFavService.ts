import Exercise from '../models/Exercise';
import ExerciseFavorite from '../models/ExerciseFavorite';
import WordFavorite from '../models/WordFavorite';

class ExeFavService {
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

 /**
  * 查看某练习是否收藏
  * @param {string} userId - 用户ID
  * @param {string} exerciseId - 练习ID
  * @returns {Promise<{isFavorite: boolean}>} 返回是否收藏
  */
  async checkFavStatusByExeId(userId: string, exerciseId: string): Promise<{isFavorite: boolean}> {
    const favoriteStatus = await ExerciseFavorite.findOne({
      userId,
      itemId: exerciseId,
      itemType: 'Exercise'
    });
    return favoriteStatus ? { isFavorite: true } : { isFavorite: false };
  }

 /**
  * 查看单个音频是否收藏
  * @param {string} userId - 用户ID
  * @param {string} audioId - 音频ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatusById(userId: string, audioId: string): Promise<boolean> {
    return await ExerciseFavorite.findOne({ userId, itemId: audioId, itemType: 'Audio' }) ? true : false;
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

 /**
  * 更新收藏状态
  * @param {string} userId - 用户ID
  * @param {string} itemId - 收藏ID
  * @param {string} itemType - 收藏类型
  * @param {boolean} isFavorite - 收藏状态
  * @returns {Promise<{isFavorite: boolean}>} 返回更新后的收藏状态
  */
  async updateFavoriteStatus(userId: string, itemId: string, itemType: string, isFavorite: boolean): Promise<{isFavorite: boolean}> {
    if (isFavorite && itemType === 'Exercise') {
      this._addFavoriteExercise(userId, itemId);
      return { isFavorite: true };
    } else if (!isFavorite && itemType === 'Exercise') {
      this._deleteFavoriteExercise(itemId);
      return { isFavorite: false };
    } else if (isFavorite && itemType === 'Audio') {
      this._addFavoriteAudio(userId, itemId);
      return { isFavorite: true };
    } else if (!isFavorite && itemType === 'Audio') {
      this._deleteFavoriteAudio(itemId);
      return { isFavorite: false };
    }
    return { isFavorite: false };
  }

  // 新增收藏练习
  async _addFavoriteExercise(userId: string, itemId: string): Promise<boolean> {
    await ExerciseFavorite.create({ userId, itemId, itemType: 'Exercise' });
    return true;
  }
  // 删除收藏练习
  async _deleteFavoriteExercise(itemId: string): Promise<boolean> {
    await ExerciseFavorite.deleteOne({ itemId });
    return true;
  }

  // 新增收藏音频
  async _addFavoriteAudio(userId: string, itemId: string): Promise<boolean> {
    await ExerciseFavorite.create({ userId, itemId, itemType: 'Audio' });
    return true;
  }
  // 删除收藏音频
  async _deleteFavoriteAudio(itemId: string): Promise<boolean> {
    await ExerciseFavorite.deleteOne({ itemId });
    return true;
  }
}

export const exeFavService = new ExeFavService(); 