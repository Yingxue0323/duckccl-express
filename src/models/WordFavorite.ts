import mongoose, { Schema, Document } from 'mongoose';

export interface IWordFavorite extends Document { 
  userId: string;
  wordId: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const WordFavoriteSchema = new Schema({
  userId: {
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
WordFavoriteSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model<IWordFavorite>('WordFavorite', WordFavoriteSchema); 