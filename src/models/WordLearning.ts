import mongoose, { Schema, Document } from 'mongoose';
import { LEARNED_STATUS, LearnedStatus } from '../utils/constants';

export interface IWordLearning extends Document {
  openId: string;
  wordId: string;
  correctCount: number;
  status: LearnedStatus;

  createdAt: Date;
  updatedAt: Date;
}

const WordLearningSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  wordId: {
    type: String,
    required: true
  },
  correctCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 21
  },
  status: {
    type: String,
    enum: Object.values(LEARNED_STATUS),
    default: LEARNED_STATUS.UNLEARNED,
    required: true
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个单词只能有一条学习记录
WordLearningSchema.index({ openId: 1, wordId: 1 }, { unique: true });
WordLearningSchema.index({ openId: 1, status: 1 });

export default mongoose.model<IWordLearning>('WordLearning', WordLearningSchema); 