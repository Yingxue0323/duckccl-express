import WordFavorite from '../models/WordFavorite';
import User from '../models/User';
import { wordService } from './wordService';

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
  async favoriteWord(openId: string, wordId: string): Promise<{isWordFavorite: boolean}> {
    // 检查是否已存在收藏
    const existingFavorite = await WordFavorite.findOne({openId, wordId});
    // 如果不存在，则新增收藏
    if (!existingFavorite) {
        await WordFavorite.create({ openId, wordId });
    }

    return { isWordFavorite: true };
  }

  /**
   * 删除收藏单词
   * @param {string} openId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<{isFavorite: boolean}>} 返回删除后的收藏状态
   */
  async unfavoriteWord(openId: string, wordId: string): Promise<{isWordFavorite: boolean}> {
    // 检查是否已存在收藏
    const favoriteStatus = await WordFavorite.findOne({ openId, wordId });
    // 如果存在，则删除收藏
    if (favoriteStatus) {
      await WordFavorite.deleteOne({ _id: favoriteStatus._id });
    }
    return { isWordFavorite: false };
  }
}

export const wordFavService = new WordFavService(); 