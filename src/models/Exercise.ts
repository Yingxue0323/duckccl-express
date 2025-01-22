import mongoose, { Schema, Document } from 'mongoose';
import { EXERCISE_CATEGORIES, ExerciseSource,
         EXERCISE_SOURCES, ExerciseCategory } from '../config/constants';

export interface IExercise extends Document {
  title: string;
  intro: string;
  dialogs: mongoose.Types.ObjectId[];
  category: ExerciseCategory;
  source: ExerciseSource;
  isVIPOnly: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  intro: { 
    type: String, 
    required: true 
  },
  dialogs: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Dialog',
    required: true 
  }],
  category: { 
    type: String, 
    enum: Object.values(EXERCISE_CATEGORIES),
    required: true 
  },
  source: {
    type: String,
    enum: Object.values(EXERCISE_SOURCES),
    required: true
  },
  isVIPOnly: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true 
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);