import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPractice extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  audioId: mongoose.Types.ObjectId;
  recordingUrl: string;           // 用户录制的音频
  duration: number;

  createdAt: Date;
  updatedAt: Date;
}

const UserPracticeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  audioId: {
    type: Schema.Types.ObjectId,
    ref: 'Audio',
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
UserPracticeSchema.index({ userId: 1, audioId: 1, createdAt: -1 });

export default mongoose.model<IUserPractice>('UserPractice', UserPracticeSchema); 