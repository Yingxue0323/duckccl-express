import mongoose, { Schema, Document } from 'mongoose';
import { LanguageCode } from '../utils/constants';

interface AudioContent {
  url: string;
  duration: number;
  text: string;
}

const AudioContentSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  text: {
    type: String,
    required: true
  }
}, { _id: false });


export interface IAudio extends Document {
  _id: mongoose.Types.ObjectId;
  sequence: 1 | 2;
  englishContent: AudioContent;
  contents: Map<LanguageCode, AudioContent>;

  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema({
  sequence: {
    type: Number,
    required: true,
    enum: [1, 2]
  },
  englishContent: {
    type: AudioContentSchema,
    required: true
  },
  contents: {
    type: Map,
    of: AudioContentSchema
  }
}, {
  timestamps: true
});


export default mongoose.model<IAudio>('Audio', AudioSchema); 