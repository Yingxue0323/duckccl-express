import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseLearning extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  isLearned: boolean;
  lastLearnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseLearningSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  isLearned: {
    type: Boolean,
    default: false
  },
  lastLearnedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个练习只能有一条学习记录
ExerciseLearningSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export default mongoose.model<IExerciseLearning>('ExerciseLearning', ExerciseLearningSchema); 