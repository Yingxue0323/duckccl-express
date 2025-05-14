import WordFavorite from '../models/WordFavorite';
import User from '../models/User';

class WordFavService {
 /**
  * 获取所有所有收藏id列表和数量
  * @param {string} openId - 用户ID
  * @returns {Promise<any>} 返回所有收藏单词id列表和数量
  */
  async getAllFavoriteWords(openId: string): Promise<{count: number, ids: string[]}> {
    const favoriteList = await WordFavorite.find({openId: openId}).select('wordId').lean();
    return {
      count: favoriteList.length,
      ids: favoriteList.map(item => item.wordId.toString())
    }
  }

 /**
  * 查看单个单词是否收藏
  * @param {string} openId - 用户ID
  * @param {string} wordId - 单词ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatus(openId: string, wordId: string): Promise<boolean> {
    const favoriteStatus = await WordFavorite.findOne({ openId, wordId });
    return favoriteStatus ? true : false;
  }

 /**
  * 新增收藏单词
  * @param {string} openId - 用户ID
  * @param {string} wordId - 单词ID
  * @returns {Promise<{isWordFavorite: boolean}>} 返回新增后的收藏状态
  */
  async favoriteWord(openId: string, wordId: string): Promise<{ isWordFavorite: boolean }> {
    try {
      // 尝试直接创建，避免手动查重
      await WordFavorite.create({ openId, wordId });

      // 只有创建成功时才 +1
      await User.updateOne(
        { openId },
        { $inc: { 'favoriteCount.word': 1 } }
      );
    } catch (err: any) {
      // 如果是唯一索引冲突（重复收藏）
      if (err.code === 11000) {
        // 已经收藏了，忽略
      } else {
        throw err; // 其他错误抛出
      }
    }

    return { isWordFavorite: true };
  }

/**
   * 删除收藏单词
   * @param {string} openId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<{isFavorite: boolean}>} 返回删除后的收藏状态
   */
      async unfavoriteWord(openId: string, wordId: string): Promise<{ isWordFavorite: boolean }> {
        // 删除收藏记录
        const result = await WordFavorite.findOneAndDelete({ openId, wordId });

        // 只有删除成功时才 -1
        if (result) {
          await User.updateOne(
            { openId },
            { $inc: { 'favoriteCount.word': -1 } }
          );
        }

        return { isWordFavorite: false };
      }
}

export const wordFavService = new WordFavService(); 