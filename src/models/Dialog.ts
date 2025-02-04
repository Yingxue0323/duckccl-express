import mongoose, { Schema, Document } from 'mongoose';

export interface IDialog extends Document {
  _id: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId; 
  sequence: number;
  audioIds: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const DialogSchema = new Schema({
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sequence: {
    type: Number,
    required: true
  },
  audioIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Audio',
    required: true
  }]
}, {
  timestamps: true
});

// 确保每个练习题的对话序号唯一
DialogSchema.index({ exerciseId: 1, sequence: 1 }, { unique: true });

export default mongoose.model<IDialog>('Dialog', DialogSchema); 