import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category } from '../utils/constants';

export interface IWord extends Document {
  sequence: number; // 全局唯一
  category: Category;
  order: number;

  word: string;
  url: string;
  translation: string;

  createdAt: Date;
  updatedAt: Date;
}

const WordSchema = new Schema({
  sequence: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    enum: Object.values(CATEGORIES),
    required: true,
    index: true
  },
  order: {
    type: Number,
    required: true
  },
  word: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IWord>('Word', WordSchema); 