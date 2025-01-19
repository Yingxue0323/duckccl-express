import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode } from '../config/constants';

export interface IAudio extends Document {
  parentId: mongoose.Types.ObjectId;  
  parentModel: string;                  // 'DIALOG'|'INTRO'
  language: LanguageCode;               
  url: string;                          
  duration: number;                       
  translations: {
    language: LanguageCode;
    text: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema({
  parentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  parentModel: {
    type: String,
    enum: ['DIALOG', 'INTRO'],
    required: true
  },
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    required: true
  },
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
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
  }]
}, {
  timestamps: true
});

// 确保每个parent的每种语言并发情况下的原子性
AudioSchema.index({ parentId: 1, language: 1 }, { unique: true });

export default mongoose.model<IAudio>('Audio', AudioSchema); 