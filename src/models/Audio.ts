import mongoose, { Schema } from "mongoose"
import { LANGUAGES, LanguageCode } from "../utils/constants"

export interface IAudio extends Document {
  _id: mongoose.Types.ObjectId;
  exerciseId: string;
  order: number;
  language: LanguageCode;

  text: string;
  url: string;
  duration: number;

  trans_text?: string;
  trans_url?: string;
  trans_duration?: number;

  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema({
  exerciseId: {
    type: String,
    required: true,
    index: true
  },
  order: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    required: true,
  },
  text: {
    type: String,
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
  trans_text: {
    type: String
  },
  trans_url: {
    type: String
  },
  trans_duration: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

AudioSchema.index({ exerciseId: 1, order: 1 }, { unique: true });

export default mongoose.model<IAudio>('Audio', AudioSchema);
  