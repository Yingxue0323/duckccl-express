import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  title: string;
  intro: string;
  dialogs: mongoose.Types.ObjectId[];
  dialogCount: number;
  category: string;
  source: string;
  isVIPOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  intro: { 
    type: String, 
    required: true 
  },
  dialogs: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Dialog',
    required: true 
  }],
  dialogCount: {
    type: Number,
    default: 0
  },
  category: { 
    type: String, 
    enum: ['BUSINESS', 'EDUCATION', 'COMMUNITY', 'CONSUMER_AFFAIRS',
        'EMPLOYMENT', 'HOUSING', 'IMMIGRATION', 'INSURANCE', 'LEGAL', 
        'TRAVEL', 'ENTERTAINMENT', 'HEALTH', 'TECHNOLOGY'],
    required: true 
  },
  source: {
    type: String,
    enum: ['QUESTION_BANK', 'EXAM_MEMORY'],
    required: true
  },
  isVIPOnly: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true 
});

// 虚拟字段：根据用户VIP状态返回不同的内容
ExerciseSchema.methods.toJSON = function(user?: { isVIP: boolean }) {
  const exercise = this.toObject();
  
  if (exercise.isVIPOnly && (!user || !user.isVIP)) {
    // 非VIP用户看到的VIP题目内容
    return {
      ...exercise,
      content: '🔒 此题目为VIP专属内容',
      isLocked: true
    };
  }
  
  // VIP用户看到的内容
  return {
    ...exercise,
    title: exercise.isVIPOnly ? `👑 ${exercise.title}` : exercise.title,
    isLocked: false
  };
};

// 添加获取对话的虚拟字段
ExerciseSchema.virtual('dialogs', {
  ref: 'Dialog',
  localField: '_id',
  foreignField: 'exerciseId',
  options: { sort: { sequence: 1 } }  // 按序号排序
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);