import ExerciseFavorite from '../models/ExerciseFavorite';
import User from '../models/User';

class ExeFavService {
 /**
  * 获取所有收藏的练习id列表和数量
  * @param {string} openId - 用户ID
  * @returns {Promise<{count: number, ids: string[]}>} 返回收藏id列表和数量
  */
  async getAllFavoriteExercises(openId: string): Promise<{count: number, ids: string[]}> {
    const favoriteList = await ExerciseFavorite.find({openId}).select('exerciseId').lean();
    return {
      count: favoriteList.length,
      ids: favoriteList.map(item => item.exerciseId.toString())
    }
  }

 /**
  * 查看某练习是否收藏
  * @param {string} openId - 用户ID
  * @param {string} exerciseId - 练习ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatus(openId: string, exerciseId: string): Promise<boolean> {
    const favoriteStatus = await ExerciseFavorite.findOne({ openId, exerciseId });
    return favoriteStatus ? true : false;
  }

 /**
  * 收藏练习
  * @param {string} openId - 用户ID
  * @param {string} exerciseId - 练习ID
  * @returns {Promise<{isExeFavorite: boolean}>} 返回更新后的收藏状态
  */
  async favoriteExercise(openId: string, exerciseId: string): Promise<{isExeFavorite: boolean}> {
    // 检查是否已存在收藏
    const existingFavorite = await ExerciseFavorite.findOne({openId, exerciseId});
    // 如果不存在，则新增收藏，更新用户收藏数+1
    if (!existingFavorite) {
        await ExerciseFavorite.create({ openId, exerciseId });
        await User.findOneAndUpdate({ openId }, { $inc: { "favoriteCount.exercise": 1 } });
    }

    return { isExeFavorite: true };
  }

  /**
   * 取消收藏练习
   * @param {string} openId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<{isExeFavorite: boolean}>} 返回是否取消收藏
   */
  async unfavoriteExercise(openId: string, exerciseId: string): Promise<{isExeFavorite: boolean}> {
    // 检查是否已存在收藏
    const favoriteStatus = await ExerciseFavorite.findOne({ openId, exerciseId });
    // 如果存在，则删除收藏，更新用户收藏数-1
    if (favoriteStatus) {
      await ExerciseFavorite.deleteOne({ _id: favoriteStatus._id });
      await User.findOneAndUpdate({ openId }, { $inc: { "favoriteCount.exercise": -1 } });
    }
    return { isExeFavorite: false };
  }
}

export const exeFavService = new ExeFavService(); 