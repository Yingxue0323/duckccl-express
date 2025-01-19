import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  openid: string;           // 微信用户唯一标识
  unionid?: string;         // 微信开放平台唯一标识（如果需要）
  nickname: string;         // 微信昵称
  avatarUrl: string;       // 微信头像
  isVIP: boolean;          // VIP状态
  vipExpireDate?: Date;    // VIP过期时间
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  openid: { 
    type: String, 
    required: true, 
    unique: true 
  },
  unionid: { 
    type: String,
    sparse: true          // 允许为空且唯一
  },
  nickname: { 
    type: String, 
    required: true 
  },
  avatarUrl: { 
    type: String,
    required: true 
  },
  isVIP: { 
    type: Boolean, 
    default: false 
  },
  vipExpireDate: { 
    type: Date,
    default: null 
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema); 