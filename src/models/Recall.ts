import mongoose, { Schema, Document } from 'mongoose';
import { CATEGORIES, Category } from '../utils/constants';

export interface IRecall extends Document {
  userOpenId: string;      // user openid
  title: string;            
  examDate: Date;
  category: Category;
  content: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const RecallSchema = new Schema({
  userOpenId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String, 
    enum: Object.values(CATEGORIES),
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model<IRecall>('Recall', RecallSchema);