import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category,
         EXERCISE_SOURCES, ExerciseSource } from '../utils/constants';

  
export interface IExercise extends Document {
  _id: mongoose.Types.ObjectId;
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
  }
}, {
  timestamps: true 
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);