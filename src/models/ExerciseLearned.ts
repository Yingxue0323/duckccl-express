import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseLearned extends Document {
  _id: mongoose.Types.ObjectId;
  openId: string;
  exerciseId: string;

  createdAt: Date;
  updatedAt: Date;
}

const ExerciseLearnedSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  exerciseId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// 复合索引：每个用户的每个练习只能有一条学习记录
ExerciseLearnedSchema.index({ openId: 1, exerciseId: 1 }, { unique: true });

export default mongoose.model<IExerciseLearned>('ExerciseLearned', ExerciseLearnedSchema); 