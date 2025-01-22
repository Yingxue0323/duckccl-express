import mongoose, { Schema, Document } from 'mongoose';
import { LanguageCode } from '../config/constants';

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
  dialogId: mongoose.Types.ObjectId;
  sequence: 1 | 2;
  englishContent: AudioContent;
  contents: {
    [key in LanguageCode]?: AudioContent;  //考虑英语使用者
  };

  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema({
  dialogId: {
    type: Schema.Types.ObjectId,
    ref: 'Dialog',
    required: true
  },
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

// 确保每个dialog的每个sequence只有一个音频记录
AudioSchema.index({ dialogId: 1, sequence: 1 }, { unique: true });

export default mongoose.model<IAudio>('Audio', AudioSchema); 