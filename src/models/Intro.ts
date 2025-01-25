import mongoose, { Schema, Document } from 'mongoose';

export interface IIntro extends Document {
  _id: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  text: string;

  url: string;
  duration: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const IntroSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
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
  }
}, {
  timestamps: true
});

// 确保每个练习题的对话序号唯一
IntroSchema.index({ exerciseId: 1 }, { unique: true });

export default mongoose.model<IIntro>('Intro', IntroSchema); 
