import WordFavorite from '../models/WordFavorite';
import User from '../models/User';
import { wordService } from './wordService';

class WordFavService {
 /**
  * 获取所有所有收藏id列表和数量
  * @param {string} userId - 用户ID
  * @returns {Promise<any>} 返回所有收藏单词id列表和数量
  */
  async getFavWordsByUserId(userId: string): Promise<{favWordCount: number, favWords: any[]}> {
    const favWordList = await WordFavorite.find({userId}).select('wordId').lean();
    const words = await Promise.all(favWordList.map(async (item) => {
      const word = await wordService.getWordById(item.wordId.toString(), userId);
      return word;
    }));

    return {
      favWordCount: favWordList.length,
      favWords: words
    }
  }

 /**
  * 查看单个单词是否收藏
  * @param {string} userId - 用户ID
  * @param {string} wordId - 单词ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatusByWordId(userId: string, wordId: string): Promise<boolean> {
    const favoriteStatus = await WordFavorite.findOne({
      userId,
      wordId: wordId,
    });
    return favoriteStatus ? true : false;
  }

 /**
  * 新增收藏单词
  * @param {string} userId - 用户ID
  * @param {string} wordId - 单词ID
  * @returns {Promise<{isFavorite: boolean}>} 返回新增后的收藏状态
  */
  async addFavoriteWord(userId: string, wordId: string): Promise<{isFavorite: boolean}> {
    await WordFavorite.create({ userId, wordId });
    await User.findByIdAndUpdate(userId, { $inc: { 'favoriteCount.word': 1 } });
    return { isFavorite: true };
  }

  /**
   * 删除收藏单词
   * @param {string} userId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<{isFavorite: boolean}>} 返回删除后的收藏状态
   */
  async deleteFavoriteWord(userId: string, wordId: string): Promise<{isFavorite: boolean}> {
    await WordFavorite.deleteOne({ wordId });
    await User.findByIdAndUpdate(userId, { $inc: { 'favoriteCount.word': -1 } });
    return { isFavorite: false };
  } 

  /**
   * 获取学习状态
   * @param {string} userId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<any>} 返回学习状态
   */
  async getLearningStatus(userId: string, wordId: string): Promise<any> {
    const learningStatus = await WordFavorite.findOne({
      userId,
      wordId: wordId,
    });
    if (!learningStatus) throw new Error('Learning status not found');
    return learningStatus;
  }
}

export const wordFavService = new WordFavService(); 