import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userOpenId: string;      // user openid
  content: string;
  isResolved: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema({
  userOpenId: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);