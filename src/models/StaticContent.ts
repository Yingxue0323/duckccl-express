import mongoose, { Schema, Document } from 'mongoose';
import { LANGUAGES, LanguageCode, 
        CONTENT_TYPE, ContentType } from '../configs/constants';

interface Translation {
  language: LanguageCode;
  title: string;
  content: string;
}

const TranslationSchema = new Schema({
  language: {
    type: String,
    enum: Object.values(LANGUAGES),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { _id: false });

/*
CONTENT_TYPE: 
  - TERMS: 用户协议
  - PRIVACY: 隐私政策
  - VIP_GUIDE: 成为会员
  - ADVANCED_INFO: 高级情报
  - ABOUT: 关于我们
*/
export interface IStaticContent extends Document {
  _id: mongoose.Types.ObjectId;
  contentType: ContentType;
  translations: {
    [key in LanguageCode]?: Translation
  };

  createdAt: Date;
  updatedAt: Date;
}

const StaticContentSchema = new Schema({
  contentType: {
    type: String,
    enum: Object.values(CONTENT_TYPE),
    required: true,
    unique: true
  },
  translations: {
    type: Map,
    of: TranslationSchema
  }
}, {
  timestamps: true
}); 

export default mongoose.model<IStaticContent>('StaticContent', StaticContentSchema); 