import mongoose, { Schema, Document } from 'mongoose';

export interface IToken extends Document {
  openId: string;
  token: string;
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema = new Schema({
  openId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// 到期自动删除文档
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IToken>('Token', TokenSchema); 