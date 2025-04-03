import mongoose, { Schema, Document } from 'mongoose';

export interface IAudioFavorite extends Document {
  _id: mongoose.Types.ObjectId;
  openId: string;
  audioId: string;
  exerciseTitle: string;
  exerciseSeq: string;

  createdAt: Date;
  updatedAt: Date;
}

const AudioFavoriteSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  audioId: {
    type: String,
    required: true,
    index: true
  },
  exerciseTitle: {
    type: String,
    required: true
  },
  exerciseSeq: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound Index: Each user cannot repeat collecting the same item
AudioFavoriteSchema.index({ openId: 1, audioId: 1 }, { unique: true });

export default mongoose.model<IAudioFavorite>('AudioFavorite', AudioFavoriteSchema); 