import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode } from '../config/constants';

export enum WordStatus {
  UNLEARNED = 'UNLEARNED',
  FAMILIAR = 'FAMILIAR',
  REVIEW = 'REVIEW'
}

export interface IWord extends Document {
  translations: {
    language: LanguageCode;
    text: string;
  }[];
  audioUrl?: string;
  category: string;
  sequence: number;
  isVIPOnly: boolean;
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
  },
  isVIPOnly: {
    type: Boolean,
    default: function(this: any) {
      return this.sequence > 100;
    }
  }
}, {
  timestamps: true
});

WordSchema.methods.toJSON = function(user?: { isVIP: boolean }) {
  const word = this.toObject();
  
  if (word.isVIPOnly && (!user || !user.isVIP)) {
    return {
      ...word,
      translations: word.translations.map((t: any) => ({
        ...t,
        text: '🔒 VIP专属单词'
      })),
      isLocked: true
    };
  }
  
  return {
    ...word,
    isLocked: false
  };
};

export default mongoose.model<IWord>('Word', WordSchema); 