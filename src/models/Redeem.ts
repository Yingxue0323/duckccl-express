import mongoose, { Schema, Document } from 'mongoose';

interface IUsed {
  usedByOpenId: string;
  usedAt: Date;
}

const UsedSchema = new Schema({
  usedByOpenId: {
    type: String,
    required: true
  },
  usedAt: { type: Date, required: true }
});

export interface IRedeem extends Document {
  inviterOpenId: string;      // inviter openid
  code: string;               // redeem code
  duration: number;           // VIP duration (days), default 7
  maxUses: number;            // max uses, default 10
  
  isUsed: boolean;           // whether the code is used
  usedBy: IUsed[];           // used by user openid list
  expiresAt: Date;           // expires at
  
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
    required: true,
    default: 7
  },
  maxUses: {
    type: Number,
    required: true,
    default: 10
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },

  isUsed: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: [UsedSchema],
    sparse: true
  },
}, {
  timestamps: true
});

// embeded multikey index
RedeemSchema.index({ 'usedBy.usedByOpenId': 1 });
RedeemSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRedeem>('Redeem', RedeemSchema);