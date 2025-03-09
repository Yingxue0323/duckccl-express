import WordLearning from '../models/WordLearning';
import { LEARNED_STATUS, LearnedStatus } from '../utils/constants';

class WordLearnService {
  /**
   * 检查单个单词学习状态(LEARNED/UNLEARNED/LEARNING)和正确次数
   * @param {string} openId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<LearnedStatus>} 返回单词学习状态和正确次数
   */
  async checkStatus(openId: string, wordId: string): Promise<{status: LearnedStatus, correctCount: number}> {
    if (!openId || !wordId) throw new Error('Open ID and Word ID are required');

    let result = await WordLearning.findOne({ openId: openId, wordId: wordId }).select('status correctCount').lean()
    const status = result ? result.status : LEARNED_STATUS.UNLEARNED;
    const correctCount = result ? result.correctCount : 0;
    
    return {
      status,
      correctCount    
    };
  }

  /**
   * 更新学习状态
   * @param {string} openId - 用户ID
   * @param {string} wordId - 单词ID
   * @param {number} correctCount - 正确次数
   * @returns {Promise<{status: LearnedStatus, correctCount: number}>} 返回更新后的次数和状态
   */
  async updateLearningStatus(openId: string, wordId: string, correctCount: number): Promise<{status: LearnedStatus, correctCount: number}> {
    let updatedStatus = correctCount >= 5 ? LEARNED_STATUS.LEARNED : correctCount >= 3 ? LEARNED_STATUS.LEARNING : LEARNED_STATUS.UNLEARNED;

    const updatedWord =await WordLearning.findOneAndUpdate(
      { openId: openId, wordId: wordId },
      { correctCount: correctCount, status: updatedStatus },
      { upsert: true, new: true }
    );
    if (!updatedWord) throw new Error('WordLearning not found');

    return {
      status: updatedWord.status,
      correctCount: updatedWord.correctCount
    };
  }

  /**
   * 获取所有学习中和已学完的单词ID列表
   * @param {string} openId - 用户openId
   * @returns {Promise<{ids: string[], count: number, wordStatuses: {[key: string]: {status: string, correctCount: number}}}> 返回所有在记录中的单词ID列表和总数
   */
  async getAllLearningWords(openId: string): Promise<{ids: string[], count: number, wordStatuses: {[key: string]: {status: string, correctCount: number}}}> {
    const query = { openId: openId };

    const learningWords = await WordLearning.find(query)
      .select('wordId status correctCount')
      .lean();

    const wordStatuses = learningWords.reduce((acc: {[key: string]: {status: string, correctCount: number}}, word) => {
      acc[word.wordId] = {
        status: word.status,
        correctCount: word.correctCount
      };
      return acc;
    }, {});
    // eg. {
      // "单词ID1": { status: "LEARNING", correctCount: 3 },
      // "单词ID2": { status: "LEARNED", correctCount: 5 },
      // "单词ID3": { status: "UNLEARNED", correctCount: 0 }
    // }

    return {
      ids: learningWords.map(word => word.wordId),
      count: learningWords.length,
      wordStatuses // 键值对，单词ID为键，单词学习状态和正确次数为值
    };
  }
}

export const wordLearnService = new WordLearnService(); 