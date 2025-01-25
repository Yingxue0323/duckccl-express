import mongoose, { Schema, Document } from 'mongoose';
import { generateUniqueUserCode } from '../utils/userCodeGenerator';
import { LANGUAGES, LanguageCode,
         LOGIN_TYPE, LoginType } from '../configs/constants';

interface IFavoriteCount {
  word: number;
  exercise: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userCode: string;        // 7-9位用户身份码，如 "0000001"
  nickname: string;
  avatarUrl?: string; 
  favoriteCount: IFavoriteCount;
  lang: LanguageCode;
  
  // VIP Status
  isVIP: boolean;
  vipExpireDate?: Date;
  redeem?: mongoose.Types.ObjectId;

  // 登陆相关
  sessionKey?: string;        // 小程序登录凭证Only
  openId: string;           // 在小程序中的唯一标识
  unionId?: string;           // 在微信开放平台中的唯一标识
  email?: string;
  loginType: LoginType;
  lastLoginAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  userCode: {
    type: String,
    unique: true,
    index: true
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
  lang: {
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
  },

  // 登陆相关
  openId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  unionId: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    index: true
  },
  sessionKey: {
    type: String
  },
  loginType: {
    type: String,
    enum: Object.values(LOGIN_TYPE),
    required: true
  },
  lastLoginAt: {
    type: Date,
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