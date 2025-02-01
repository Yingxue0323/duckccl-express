import Exercise from '../models/Exercise';
import ExerciseLearning from '../models/ExerciseLearning';
import { IUser } from '../models/User';

class ExeLearnService {
  // 新增学过的练习
  async addLearnedExercise(userId: string, exerciseId: string): Promise<boolean> {
    const result = await ExerciseLearning.create({ userId, exerciseId });
    return result ? true : false;
  }

  // 获取所有学过的练习题id列表
  async getLearnedExercisesList(userId: string): Promise<string[]> {
    const learnedList = await ExerciseLearning.find({
      userId,
      isLearned: true
    }).select('exerciseId').lean();
      
    return learnedList.map(status => status.exerciseId.toString());
  }

  // 获取单个练习是否学过
  async getLearningStatusByExeId(userId: string, exerciseId: string): Promise<boolean> {
    const learningStatus = await ExerciseLearning.findOne({
      userId,
      exerciseId
    });
    return learningStatus?.isLearned || false;
  }

  // 获取单个练习详情
  async getLearnedExerciseById(exerciseId: string, userId: string): Promise<any> {
    const exercise = await Exercise.findById(exerciseId)
      .populate('dialogs');  // 填充对话内容
      
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // 查询学习状态
    const learningStatus = await ExerciseLearning.findOne({
      userId,
      exerciseId
      });

      return {
        ...exercise.toObject(),
      isLearned: learningStatus?.isLearned || false
    };
  }

  // 取消学习
  async cancelLearnedExercise(userId: string, exerciseId: string): Promise<boolean> {
    const result = await ExerciseLearning.findOneAndDelete({ userId, exerciseId });
    return result ? true : false;
  }

  // 更新学习状态
  async updateLearningStatus(userId: string, exerciseId: string, isLearned: boolean): Promise<any> {
    await ExerciseLearning.findOneAndUpdate(
      { userId, exerciseId },
      { isLearned },
      { upsert: true, new: true }
    );
    return {
        message: 'UPDATE_LEARNING_STATUS_SUCCESS',
        data: { isLearned }
    };
  }
}

export const exeLearnService = new ExeLearnService(); 