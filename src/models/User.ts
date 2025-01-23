import mongoose, { Schema, Document } from 'mongoose';
import { generateUniqueUserCode } from '../utils/userCodeGenerator';
import { LANGUAGES, LanguageCode } from '../config/constants';

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
  preferredLanguage: LanguageCode;
  
  // VIP Status
  isVIP: boolean;
  vipExpireDate?: Date;
  redeem?: mongoose.Types.ObjectId;

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
    unique: true,
    index: true,
    required: true
  },
  nickname: { 
    type: String, 
    required: true 
  },
  avatarUrl: { 
    type: String
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
  preferredLanguage: {
    type: String,
    enum: Object.values(LANGUAGES),
    required: true
  },

  // VIP Status
  isVIP: {
    type: Boolean,
    default: false
  },
  vipExpireDate: {
    type: Date,
    default: null
  },
  redeem: {
    type: Schema.Types.ObjectId,
    ref: 'Redeem',
    default: null
  }
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