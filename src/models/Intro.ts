import mongoose, { Schema, Document } from 'mongoose';

export interface IIntro extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;

  url: string;
  duration: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const IntroSchema = new Schema({
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

export default mongoose.model<IIntro>('Intro', IntroSchema); 
