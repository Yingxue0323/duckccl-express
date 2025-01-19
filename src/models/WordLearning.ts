import mongoose, { Schema, Document } from 'mongoose';

export interface IWordLearning extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  correctCount: number;
  status: 'UNLEARNED' | 'LEARNING' | 'LEARNED';
  lastLearnedAt: Date;
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
    default: 0
  },
  status: {
    type: String,
    enum: ['UNLEARNED', 'LEARNING', 'LEARNED'],
    default: 'UNLEARNED'
  },
  lastLearnedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个单词只能有一条学习记录
WordLearningSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model<IWordLearning>('WordLearning', WordLearningSchema); 