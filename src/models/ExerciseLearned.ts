import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseLearned extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ExerciseLearnedSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个练习只能有一条学习记录
ExerciseLearnedSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export default mongoose.model<IExerciseLearned>('ExerciseLearned', ExerciseLearnedSchema); 