import mongoose, { Schema, Document } from 'mongoose';

export interface IRedeem extends Document {
  inviterOpenId: string; // 邀请者
  code: string;               // 兑换码
  duration: number;           // VIP时长（天数）

  // 使用情况
  isUsed: boolean;           // 是否已使用
  usedOpenId?: string;  // 使用者
  usedAt?: Date;             // 使用时间
  expiresAt: Date;           // 兑换码过期时间
  
  createdAt: Date;
  updatedAt: Date;
}

const RedeemSchema = new Schema({
  inviterOpenId: {
    type: String,
    required: true
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
    min: 1
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },

  isUsed: {
    type: Boolean,
    default: false
  },
  usedOpenId: {
    type: String,
    sparse: true
  },
  usedAt: Date
}, {
  timestamps: true
});

// 索引优化查询
RedeemSchema.index({ usedOpenId: 1, expiresAt: 1 }); 

export default mongoose.model<IRedeem>('Redeem', RedeemSchema);