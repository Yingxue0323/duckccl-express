import Word, { IWord } from '../models/Word';
import { wordFavService } from './wordFavService';
import { wordLearnService } from './wordLearnService';

class WordService {
  /**
   * 获取菜单项目
   * @returns {Promise<any>} 返回菜单项目列表
   */
  async getMenus(): Promise<any> {
    return {
      categories: ['EDUCATION', 'IMMIGRATION', 'LEGAL', 'MEDICAL', 'SOCIAL_WELFARE', 'TOURISM', 'OTHERS'],
      learnedStatus: ['LEARNED', 'UNLEARNED']
    };
  }
 /**
  * 创建单词
  * @param word (word: string, audioUrl: string, translations: string[])
  * @returns {Promise<IWord>} 返回创建的单词的raw信息
  */
  async createWord(word: any): Promise<IWord> {
    const newWord = await Word.create(word);
    const result = await newWord.save();
    return result;
  }

 /**
  * 获取所有单词
  * @returns {Promise<IWord[]>} 返回所有单词的raw信息
  */
   async getAllWords(): Promise<IWord[]> {
    return await Word.find();
  }

 /**
  * 获取某个单词
  * @param {string} wordId - 单词ID
  * @param {string} openId - 用户ID
  * @returns {Promise<any>} 返回单词格式后的信息
  */
  async getWordById(wordId: string, openId: string): Promise<any> {
    const word = await Word.findById(wordId);
    if (!word) throw new Error('Word not found');
    // const audio = await getSignedUrl(word.audioUrl);

    const isFavorite = await wordFavService.checkFavStatusByWordId(openId, wordId);
    const learningStatus = await wordLearnService.checkStatus(openId, wordId);

    return {
      wordId: word._id.toString(),
      word: word.word,
      // audio: audio,
      translations: word.translations,
      isFavorite: isFavorite,
      learningStatus: learningStatus
    };
  }

 /**
  * 更新单词
  * @param {string} wordId - 单词ID
  * @param {any} word - 单词信息（word: string, audioUrl: string, translations: string[])
  * @returns {Promise<IWord>} 返回更新后的单词的raw信息
  */
  async updateWord(wordId: string, word: any): Promise<IWord> {
    const updatedWord = await Word.findByIdAndUpdate(wordId, word, { new: true });
    if (!updatedWord) throw new Error('Word not found');
    return updatedWord;
  }

  /**
   * 删除单词
   * @param {string} wordId - 单词ID
   * @returns {Promise<boolean>} 返回删除成功与否
   */ 
  async deleteWord(wordId: string): Promise<boolean> {
    const deletedWord = await Word.findByIdAndDelete(wordId);
    if (!deletedWord) throw new Error('Word not found');

    return true;
  }
  
}

export const wordService = new WordService(); 