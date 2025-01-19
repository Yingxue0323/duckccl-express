import mongoose, { Schema, Document } from 'mongoose';
import { generateUniqueUserCode } from '../utils/userCodeGenerator';

interface IFavoriteCount {
  word: number;
  exercise: number;
}

export interface IUser extends Document {
  openid: string;           // 微信用户唯一标识
  userCode: string;        // 7-9位用户身份码，如 "0000001"
  unionid?: string;         // 微信开放平台唯一标识（如果需要）
  nickname: string;
  avatarUrl: string; 
  favoriteCount: IFavoriteCount;
  
  // VIP Status
  isVIP: boolean;
  vipExpireDate?: Date;
  vipHistory: {
    source: 'PURCHASE' | 'INVITATION';
    duration: number;     // 天数
    startDate: Date;
    endDate: Date;
    inviterId?: mongoose.Types.ObjectId;
  }[];

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
    sparse: true,
    unique: true
  },
  userCode: {
    type: String,
    unique: true
  },
  nickname: { 
    type: String, 
    required: true 
  },
  avatarUrl: { 
    type: String,
    required: true 
  },
  favoriteCount: {
    word: {
      type: Number,
      default: 0
    },
    exercise: {
      type: Number,
      default: 0
    },
    _id: false
  },
  isVIP: {
    type: Boolean,
    default: false
  },
  vipExpireDate: {
    type: Date,
    default: null
  },
  vipHistory: [{
    source: {
      type: String,
      enum: ['PURCHASE', 'INVITATION'],
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    inviterId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _id: false
  }]
}, {
  timestamps: true
});

// Auto generate user code
UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.userCode = await generateUniqueUserCode();
  }
  next();
});

UserSchema.virtual('formattedUserCode').get(function() {
  return this.userCode ? this.userCode.padStart(7, '0') : '';
});

UserSchema.index({ userCode: 1 }, { unique: true });


export default mongoose.model<IUser>('User', UserSchema); 