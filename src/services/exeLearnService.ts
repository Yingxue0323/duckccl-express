import Exercise from '../models/Exercise';
import ExerciseLearned from '../models/ExerciseLearned';
import { IUser } from '../models/User';

class ExeLearnService {
  // 新增学过的练习
  async addLearnedExercise(userId: string, exerciseId: string): Promise<boolean> {
    const result = await ExerciseLearned.create({ userId, exerciseId });
    return result ? true : false;
  }

  /**
   * 获取所有学过的练习题id列表
   * @param {string} userId - 用户ID
   * @returns {Promise<string[]>} 返回学过的练习题id列表
   */
  async getLearnedExercisesList(userId: string): Promise<string[]> {
    const learnedList = await ExerciseLearned.find({ userId: userId }).select('exerciseId').lean();
    return learnedList.map(status => status.exerciseId.toString());
  }

  /**
   * 获取单个练习是否学过
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<boolean>} 返回练习是否学过
   */
  async checkLearningStatusByExeId(userId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    return await ExerciseLearned.findOne({ userId: userId, exerciseId: exerciseId }) ? { isLearned: true } : { isLearned: false }; 
  }

  // 获取单个练习详情
  async getLearnedExerciseById(exerciseId: string, userId: string): Promise<any> {
    const exercise = await Exercise.findById(exerciseId)
      .populate('dialogs');  // 填充对话内容
      
    if (!exercise) {
      throw new Error('Exercise not found');
    }

    // 查询学习状态
    const learningStatus = await ExerciseLearned.findOne({
      userId,
      exerciseId
      });

      return {
        ...exercise.toObject(),
      isLearned: learningStatus ? true : false
    };
  }

  // 取消学习
  async cancelLearnedExercise(userId: string, exerciseId: string): Promise<boolean> {
    const result = await ExerciseLearned.findOneAndDelete({ userId, exerciseId });
    return result ? true : false;
  }

  /**
   * 更新学习状态
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @param {boolean} isLearned - 学习状态
   * @returns {Promise<any>} 返回更新后的学习状态
   */
  async updateLearningStatus(userId: string, exerciseId: string, isLearned: boolean): Promise<{isLearned: boolean}> {
    await ExerciseLearned.findOneAndUpdate(
      { userId, exerciseId },
      { isLearned },
      { upsert: true, new: true }
    );
    return { isLearned: !isLearned };
  }
}

export const exeLearnService = new ExeLearnService(); 