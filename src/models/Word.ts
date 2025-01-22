import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode } from '../config/constants';


export interface IWord extends Document {
  translations: {
    language: LanguageCode;
    text: string;
  }[];
  audioUrl?: string;
  category: string;
  sequence: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const WordSchema = new Schema({
  translations: [{
    language: {
      type: String,
      enum: Object.values(LANGUAGES),
      required: true
    },
    text: {
      type: String,
      required: true
    },
    _id: false
  }],
  audioUrl: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IWord>('Word', WordSchema); 