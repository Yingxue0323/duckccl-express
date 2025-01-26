import mongoose, { Schema, Document } from 'mongoose';
import { WORD_STATUS, WordStatus } from '../utils/constants';

export interface IWordLearning extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  correctCount: number;
  status: WordStatus;

  createdAt: Date;
  updatedAt: Date;
}

const WordLearningSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordId: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
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
    enum: Object.values(WORD_STATUS),
    default: WORD_STATUS.UNLEARNED,
    required: true
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个单词只能有一条学习记录
WordLearningSchema.index({ userId: 1, wordId: 1 }, { unique: true });
WordLearningSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IWordLearning>('WordLearning', WordLearningSchema); 