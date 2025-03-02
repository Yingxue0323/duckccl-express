import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category,
         EXERCISE_SOURCES, ExerciseSource } from '../utils/constants';

  
export interface IExercise extends Document {
  _id: mongoose.Types.ObjectId;
  order: number;
  seq: string;
  title: string;
  category: Category;
  source: ExerciseSource;
  isVIPOnly: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema({
  seq: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: Object.values(CATEGORIES),
    required: true,
    index: true
  },
  source: {
    type: String,
    enum: Object.values(EXERCISE_SOURCES),
    required: true
  },
  isVIPOnly: { 
    type: Boolean, 
    default: false,
    required: true,
    index: true
  },
  order: {
    type: Number,
    unique: true,
    index: true
  }
}, {
  timestamps: true 
});

// 添加 pre save 中间件来自动设置 order
ExerciseSchema.pre('save', async function(next) {
  if (this.isNew) {
    // 使用正确的类型转换
    const Exercise = mongoose.model('Exercise');
    const maxOrder = await Exercise.findOne().sort('-order');
    this.order = maxOrder ? maxOrder.order + 1 : 1;
  }
  next();
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);