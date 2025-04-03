import mongoose, { Schema, Document } from 'mongoose';

export interface IRedeem extends Document {
  inviterOpenId: string;      // inviter openid
  code: string;               // redeem code
  duration: number;           // VIP duration (days)
  expiresAt: Date;           // expires at
  
  isUsed: boolean;           // whether the code is used
  usedByOpenId: string;
  usedAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const RedeemSchema = new Schema({
  inviterOpenId: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  duration: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },

  isUsed: {
    type: Boolean,
    default: false
  },
  usedByOpenId: {
    type: String,
    default: null
  },
  usedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IRedeem>('Redeem', RedeemSchema);