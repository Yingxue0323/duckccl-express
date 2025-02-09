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
    // 检查是否已存在收藏
    const existingFavorite = await ExerciseFavorite.findOne({
      userId,
      itemId,
      itemType
    });
    // 如果已存在收藏
    if (existingFavorite) {
      // 如果取消收藏，则删除记录，并减少 favoriteCount
      if (!isFavorite) {
        await ExerciseFavorite.deleteOne({ _id: existingFavorite._id });

        if (itemType === "Exercise") {
          await User.findByIdAndUpdate(userId, { $inc: { "favoriteCount.exercise": -1 } });
        } else if (itemType === "Audio") {
          await User.findByIdAndUpdate(userId, { $inc: { "favoriteCount.audio": -1 } }); 
        }
      } 
    } else { 
      // 如果不存在收藏，打算新增，则添加收藏
      if (isFavorite) {
        await ExerciseFavorite.create({ userId, itemId, itemType });

        if (itemType === "Exercise") {
          await User.findByIdAndUpdate(userId, { $inc: { "favoriteCount.exercise": 1 } });
        } else if (itemType === "Audio") {
          await User.findByIdAndUpdate(userId, { $inc: { "favoriteCount.audio": 1 } });
        }
      }
    }

    return { isFavorite };
  }
}

export const exeFavService = new ExeFavService(); 