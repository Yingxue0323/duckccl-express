import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category,
         EXERCISE_SOURCES, ExerciseSource } from '../utils/constants';

export interface IExercise extends Document {
  _id: mongoose.Types.ObjectId;
  seq: number;
  title: string;
  introId: mongoose.Types.ObjectId;
  dialogIds: mongoose.Types.ObjectId[];
  category: Category;
  source: ExerciseSource;
  isVIPOnly: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema({
  seq: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  title: { 
    type: String, 
    required: true 
  },
  introId: { 
    type: Schema.Types.ObjectId,
    ref: 'Intro',
    required: true 
  },
  dialogIds: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Dialog',
    required: true 
  }],
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
    required: true
  }
}, {
  timestamps: true 
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);