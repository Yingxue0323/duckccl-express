import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  openId: string;
  exerciseId: string;

  createdAt: Date;
  updatedAt: Date;
}

const ExerciseFavoriteSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  exerciseId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound Index: Each user cannot repeat collecting the same item
ExerciseFavoriteSchema.index({ openId: 1, exerciseId: 1 }, { unique: true });

export default mongoose.model<IExerciseFavorite>('ExerciseFavorite', ExerciseFavoriteSchema); 