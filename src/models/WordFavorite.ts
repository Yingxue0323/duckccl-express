import mongoose, { Schema, Document } from 'mongoose';

export interface IWordFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  wordId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WordFavoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordId: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  }
}, {
  timestamps: true
});

// Compound Index: Each user cannot repeat collecting the same word
WordFavoriteSchema.index({ userId: 1, wordId: 1 }, { unique: true });

export default mongoose.model<IWordFavorite>('WordFavorite', WordFavoriteSchema); 