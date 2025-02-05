import mongoose, { Schema, Document } from 'mongoose';

export interface IDialog extends Document {
  _id: mongoose.Types.ObjectId;
  sequence: number;
  audioIds: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const DialogSchema = new Schema({
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

export default mongoose.model<IDialog>('Dialog', DialogSchema); 