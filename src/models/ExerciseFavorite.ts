import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemType: 'Exercise' | 'Audio';
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseFavoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    refPath: 'itemType',
    required: true
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
ExerciseFavoriteSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model<IExerciseFavorite>('ExerciseFavorite', ExerciseFavoriteSchema); 