import mongoose, { Schema, Document } from 'mongoose';

export interface IWordFavorite extends Document { 
  openId: string;
  wordId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const WordFavoriteSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  wordId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound Index: Each user cannot repeat collecting the same word
WordFavoriteSchema.index({ openId: 1, wordId: 1 }, { unique: true });

export default mongoose.model<IWordFavorite>('WordFavorite', WordFavoriteSchema); 