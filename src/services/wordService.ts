import Word, { IWord } from '../models/Word';
import { wordFavService } from './wordFavService';
import { wordLearnService } from './wordLearnService';
import { ParamError } from '../utils/errors';
import { ResponseCode } from '../utils/constants';

class WordService {
  /**
   * 获取菜单项目
   * @returns {Promise<any>} 返回菜单项目列表
   */
  async getMenus(): Promise<any> {
    return {
      categories: ['EDUCATION', 'IMMIGRATION', 'LEGAL', 'MEDICAL', 'SOCIAL_WELFARE', 'TOURISM', 'OTHERS'],
      learnedStatus: ['LEARNED', 'UNLEARNED', 'MASTERED']
    };
  }

 /**
  * 创建单词
  * @param word (category, order, text, url, translation)
  * @returns {Promise<IWord>} 返回创建的单词的raw信息
  */
  async createWord(word: any): Promise<IWord> {
    if (!word.category || !word.order || !word.text || !word.url || !word.translation) {
      throw new ParamError(ResponseCode.INVALID_PARAM, 'Invalid new word data');
    }
    const newWord = await Word.create(word);
    const result = await newWord.save();
    return result;
  }

 /**
  * 获取所有单词
  * @param {string} openId - 用户ID
  * @param {number} page - 当前页码
  * @param {number} page_size - 每页条数
  * @param {string[]} category - 分类
  * @param {string} learning_status - 学习状态
  * @param {boolean} favorite - 是否收藏，默认undefined
  * @param {boolean} random - 是否随机，默认false
  * @returns {Promise<any>} 返回所有单词formatted信息
  */
  async getAllWordsByCat(openId: string, page?: number, page_size?: number, category?: string[], learning_status?: string, favorite?: boolean, random: boolean = false): Promise<any> {
    if (!openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'OpenId is required for getAllWordsByCat');
    
    // 页数处理
    if (!page) page = 1;
    if (!page_size) page_size = 25;
    const skip = (page - 1) * page_size; // 计算跳过的记录数

    // 参数处理
    const query: any = {};
    if (category) query.category = { $in: category };
    if (learning_status) query.learning_status = learning_status;

    // 1. 获取筛选后的单词们简要信息，所有已学单词列表（含learning和mastered两种）、收藏列表
    const [words, learnedList, favoritesList] = await Promise.all([
      Word.find(query)
        .sort({ text: 1 })
        .skip(skip)
        .limit(page_size)
        .select('_id category text')
        .lean(),
      wordLearnService.getAllLearningWords(openId),
      wordFavService.getAllFavoriteWords(openId),
    ]);

    const learnedSet = new Set(learnedList.ids);
    const favoriteSet = new Set(favoritesList.ids);

    let filteredWords = words;
    // 3. 筛选收藏/不限制的单词
    if (favorite === true) {
      filteredWords = filteredWords.filter((word: any) => favoriteSet.has(word._id.toString()));
    }

    // 4. 根据学习状态筛选
    if (learning_status) {
      if (learning_status === 'UNLEARNED') {
        // 未学习的单词 = 不在学习记录中的单词
        filteredWords = filteredWords.filter((word: any) => !learnedSet.has(word._id.toString()));
      } else {
        // LEARNING 或 MASTERED 状态 = 在学习记录中且状态匹配的单词
        filteredWords = filteredWords.filter((word: any) => {
          const wordId = word._id.toString();
          return learnedSet.has(wordId) && learnedList.wordStatuses[wordId].status === learning_status;
        });
      }
    }

    let shuffledWords = filteredWords;
    // 5. 随机打乱数组
    if (random === true) {
      shuffledWords = shuffledWords.sort(() => Math.random() - 0.5);
    }

    // 6. 添加学习状态信息
    const wordList = shuffledWords.map((word: any) => {
      const wordId = word._id.toString();
      const wordStatus = learnedList.wordStatuses[wordId] || { status: 'UNLEARNED', correctCount: 0 };
      return {
        is_word_favorite: favoriteSet.has(wordId),
        learn_status: wordStatus.status,
        correct_count: wordStatus.correctCount,
        ...word,
      };
    });

    // 7. 返回带统计值的结果
    return {
      current_page: page,
      total_pages: Math.ceil(filteredWords.length / page_size),
      word_count: filteredWords.length,
      learned_count: learnedList.count,
      favorite_count: favoritesList.count,
      words: wordList,
    };
  }

 /**
  * 获取某个单词
  * @param {string} wordId - 单词ID
  * @param {string} openId - 用户ID
  * @returns {Promise<any>} 返回单词格式后的信息
  */
  async getWordById(wordId: string, openId: string): Promise<any> {
    if (!wordId || !openId) throw new ParamError(ResponseCode.INVALID_PARAM, 'Word ID and User openId are required');
    const word = await Word.findById(wordId)
      .select('_id category text url translation')
      .lean();
    if (!word) throw new Error('Word not found');

    const [learningStatus, isWordFavorite] = await Promise.all([
      wordLearnService.checkStatus(openId, wordId),
      wordFavService.checkFavStatus(openId, wordId),
    ]);

    return {
      is_word_favorite: isWordFavorite,
      learning_status: learningStatus.status,
      correct_count: learningStatus.correctCount,
      ...word,
    };
  }

 /**
  * 更新单词
  * @param {string} wordId - 单词ID
  * @param {any} word - 单词信息
  * @returns {Promise<IWord>} 返回更新后的单词的raw信息
  */
  async updateWord(wordId: string, word: any): Promise<IWord> {
    if (!wordId || !word) throw new ParamError(ResponseCode.INVALID_PARAM, 'Word ID and update data are required');
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
    if (!wordId) throw new ParamError(ResponseCode.INVALID_PARAM, 'Word ID is required');
    const deletedWord = await Word.findByIdAndDelete(wordId);
    if (!deletedWord) throw new Error('Word not found');

    return true;
  }
}

export const wordService = new WordService(); 