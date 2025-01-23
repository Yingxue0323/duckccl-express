import mongoose, { Schema, Document } from 'mongoose';

export interface IRedeem extends Document {
  inviterId: mongoose.Types.ObjectId; // 邀请者
  code: string;               // 兑换码
  duration: number;           // VIP时长（天数）

  // 使用情况
  isUsed: boolean;           // 是否已使用
  usedById?: mongoose.Types.ObjectId;  // 使用者
  usedAt?: Date;             // 使用时间
  expiresAt: Date;           // 兑换码过期时间
  
  createdAt: Date;
  updatedAt: Date;
}

const RedeemSchema = new Schema({
  inviterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
  usedById: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  usedAt: Date
}, {
  timestamps: true
});

// 索引优化查询
RedeemSchema.index({ usedById: 1, expiresAt: 1 }); 

export default mongoose.model<IRedeem>('Redeem', RedeemSchema);