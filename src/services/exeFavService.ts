import ExerciseFavorite from '../models/ExerciseFavorite';
import User from '../models/User';

class ExeFavService {
 /**
  * 获取所有收藏的练习id列表和数量
  * @param {string} userId - 用户ID
  * @returns {Promise<{count: number, ids: string[]}>} 返回收藏id列表和数量
  */
  async getAllFavoriteExercises(userId: string): Promise<{count: number, ids: string[]}> {
    const favoriteList = await ExerciseFavorite.find({userId, itemType: 'Exercise'})
      .select('itemId').lean();
    return {
      count: favoriteList.length,
      ids: favoriteList.map(item => item.itemId.toString())
    }
  }

 /**
  * 获取所有收藏的音频id列表和数量
  * @param {string} userId - 用户ID
  * @returns {Promise<{count: number, ids: string[]}>} 返回收藏id列表和数量
  */
  async getAllFavoriteAudios(userId: string): Promise<{count: number, ids: string[]}> {
    const favList = await ExerciseFavorite.find({userId, itemType: 'Audio'})
      .select('itemId').lean();
    return {
      count: favList.length,
      ids: favList.map(item => item.itemId.toString())
    }
  }

 /**
  * 查看某练习是否收藏
  * @param {string} userId - 用户ID
  * @param {string} exerciseId - 练习ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatusByExeId(userId: string, exerciseId: string): Promise<boolean> {
    const favoriteStatus = await ExerciseFavorite.findOne({
      userId,
      itemId: exerciseId,
      itemType: 'Exercise'
    });
    return favoriteStatus ? true : false;
  }

 /**
  * 查看单个音频是否收藏
  * @param {string} userId - 用户ID
  * @param {string} audioId - 音频ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatusByAudioId(userId: string, audioId: string): Promise<boolean> {
    const favoriteStatus = await ExerciseFavorite.findOne({
      userId,
      itemId: audioId,
      itemType: 'Audio'
    });
    return favoriteStatus ? true : false;
  }

 /**
  * 更新收藏状态
  * @param {string} userId - 用户ID
  * @param {string} itemId - 收藏ID
  * @param {string} itemType - 收藏类型
  * @param {boolean} isFavorite - 想成为的收藏状态
  * @returns {Promise<{isFavorite: boolean}>} 返回更新后的收藏状态
  */
  async updateItemFavorites(userId: string, itemId: string, itemType: string, isFavorite: boolean): Promise<{isFavorite: boolean}> {
    if (isFavorite && itemType === 'Exercise') {
      await this._addFavoriteExercise(userId, itemId);
    } else if (!isFavorite && itemType === 'Exercise') {
      await this._deleteFavoriteExercise(itemId);
    } else if (isFavorite && itemType === 'Audio') {
      await this._addFavoriteAudio(userId, itemId);
    } else if (!isFavorite && itemType === 'Audio') {
      await this._deleteFavoriteAudio(itemId);
    }

    // 更新用户收藏数量
    if (isFavorite) {
      await User.findByIdAndUpdate(userId, { $inc: { 'favoriteCount.exercise': 1 } });
      return { isFavorite: true };
    } else {
      await User.findByIdAndUpdate(userId, { $inc: { 'favoriteCount.exercise': -1 } });
      return { isFavorite: false };
    }
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