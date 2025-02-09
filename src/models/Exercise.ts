import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category,
         EXERCISE_SOURCES, ExerciseSource } from '../utils/constants';

interface Audio {
  _id: mongoose.Types.ObjectId;
  order: number;
  text: string;
  url: string;
  trans?: string;
  trans_url?: string;
  duration: number
}

const AudioSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  trans: {
    type: String
  },
  trans_url: {
    type: String
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  }
});


const DialogSchema = new Schema({
  order: {
    type: Number,
    required: true
  },
  audios: {
    type: [AudioSchema],
    required: true
  }
}, { _id: false });
  
export interface IExercise extends Document {
  _id: mongoose.Types.ObjectId;
  seq: string;
  title: string;
  category: Category;
  source: ExerciseSource;
  isVIPOnly: boolean;
  intro: Audio;
  dialogs: Audio[];
  
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
    required: true
  },
  intro: { 
    type: AudioSchema,
  },
  dialogs: { 
    type: [AudioSchema],
  }
}, {
  timestamps: true 
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);