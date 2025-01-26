import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode, 
          CATEGORIES, Category } from '../utils/constants';

interface Translation {
  language: LanguageCode;
  text: string;
  audioUrl: string;
}

const TranslationSchema = new Schema({
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    required: true
  },
  text: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  }
}, { _id: false });

export interface IWord extends Document {
  _id: mongoose.Types.ObjectId;
  word: string;
  audioUrl: string;
  translations: {
    [key in LanguageCode]?: Translation
  };
  category: Category;

  createdAt: Date;
  updatedAt: Date;
}

const WordSchema = new Schema({
  word: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  translations: {
    type: Map,
    of: TranslationSchema
  },
  category: {
    type: String,
    enum: Object.values(CATEGORIES),
    required: true,
    index: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IWord>('Word', WordSchema); 