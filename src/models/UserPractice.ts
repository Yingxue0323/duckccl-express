import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPractice extends Document {
  openId: string;
  audioId: string;
  recordingUrl: string;           // 用户录制的音频
  duration: number;

  createdAt: Date;
  updatedAt: Date;
}

const UserPracticeSchema = new Schema({
  openId: {
    type: String,
    required: true
  },
  audioId: {
    type: String,
    required: true
  },
  recordingUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// 用户可以多次练习同一个对话
UserPracticeSchema.index({ openId: 1, audioId: 1, createdAt: -1 });

export default mongoose.model<IUserPractice>('UserPractice', UserPracticeSchema); 