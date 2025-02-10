import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  openId: string;
  itemId: string;
  itemType: 'Exercise' | 'Audio';

  createdAt: Date;
  updatedAt: Date;
}

const ExerciseFavoriteSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true,
    index: true
  },
  itemType: {
    type: String,
    enum: ['Exercise', 'Audio'],
    required: true
  }
}, {
  timestamps: true
});

// Compound Index: Each user cannot repeat collecting the same item
ExerciseFavoriteSchema.index({ openId: 1, itemId: 1 }, { unique: true });

export default mongoose.model<IExerciseFavorite>('ExerciseFavorite', ExerciseFavoriteSchema); 