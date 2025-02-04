import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode } from '../utils/constants';
import { LearningStatus } from '../models/WordLearningStatus';
import Word from '../models/Word';
import WordLearningStatus from '../models/WordLearningStatus';

class WordService {
  // 获取用户的学习队列（未学+在学）
  async getLearningQueue(userId: string, lang: LanguageCode) {
    const learningStatuses = await WordLearningStatus.find({
      userId,
      status: { $ne: LearningStatus.COMPLETED }
    }).select('wordId');

    const wordIds = learningStatuses.map(status => status.wordId);

    return Word.find({ _id: { $in: wordIds } })
      .sort('sequence')
      .select('translations audioUrl');
  }

  // 获取闪卡单词（仅在学状态）
  async getFlashcards(userId: string, lang: LanguageCode) {
    const learningStatuses = await WordLearningStatus.find({
      userId,
      status: LearningStatus.LEARNING
    }).select('wordId');

    const wordIds = learningStatuses.map(status => status.wordId);

    return Word.find({ _id: { $in: wordIds } })
      .sort('sequence')
      .select('translations audioUrl');
  }

  // 更新单词学习状态
  async updateWordStatus(userId: string, wordId: string, correct: boolean) {
    let status = await WordLearningStatus.findOne({ userId, wordId });
    
    if (!status) {
      status = new WordLearningStatus({
        userId,
        wordId,
        status: LearningStatus.LEARNING
      });
    }

    return status.updateProgress(correct);
  }

  // 获取单词分类统计
  async getWordStats(userId: string) {
    return WordLearningStatus.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }
}

export default new WordService(); 