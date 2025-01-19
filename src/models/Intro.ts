import mongoose, { Schema, Document } from 'mongoose';

export interface IIntro extends Document {
  exerciseId: mongoose.Types.ObjectId;
  audio: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const IntroSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  audio: [{
    type: Schema.Types.ObjectId,
    ref: 'Audio',
    required: true
  }]
}, {
  timestamps: true
});

// 确保每个练习题的对话序号唯一
IntroSchema.index({ exerciseId: 1 }, { unique: true });

export default mongoose.model<IIntro>('Intro', IntroSchema); 
