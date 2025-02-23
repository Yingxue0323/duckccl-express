import WordLearning from '../models/WordLearning';
import Word from '../models/Word';
import { LEARNED_STATUS, LearnedStatus } from '../utils/constants';

class WordLearnService {
  /**
   * 检查单个单词学习状态(LEARNED/UNLEARNED/LEARNING)和正确次数
   * @param {string} userId - 用户ID
   * @param {string} wordId - 单词ID
   * @returns {Promise<LearnedStatus>} 返回单词学习状态和正确次数
   */
  async checkStatus(userId: string, wordId: string): Promise<{status: LearnedStatus, correctCount: number}> {
    let result = await WordLearning.findOne({ userId: userId, wordId: wordId }).select('status correctCount').lean()
    const status = result ? result.status : LEARNED_STATUS.UNLEARNED;
    const correctCount = result ? result.correctCount : 0;
    return {
      status,
      correctCount    
    };
  }

  /**
   * 更新学习状态
   * @param {string} userId - 用户ID
   * @param {string} wordId - 单词ID
   * @param {string} status - 想成为的学习状态
   * @returns {Promise<any>} 返回更新后的学习状态
   */
  async updateLearningStatus(userId: string, wordId: string, learnStatus: string): Promise<any> {
    const updatedWord =await WordLearning.findOneAndUpdate(
      { userId, wordId },
      { learnStatus: learnStatus },
      { upsert: true, new: true }
    );
    return updatedWord;
  }
}

export const wordLearnService = new WordLearnService(); 