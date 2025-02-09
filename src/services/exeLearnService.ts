import ExerciseLearned from '../models/ExerciseLearned';

class ExeLearnService {
  /**
   * 获取所有学过的练习题id列表和数量
   * @param {string} userId - 用户ID
   * @returns {Promise<{count: number, ids: string[]}>} 返回学过的练习题id列表和数量
   */
  async getAllLearnedExercises(userId: string): Promise<{count: number, ids: string[]}> {
    const learnedList = await ExerciseLearned.find({ userId: userId }).select('exerciseId').lean();
    return {
      count: learnedList.length,
      ids: learnedList.map(item => item.exerciseId.toString())
    }
  }

  /**
   * 获取单个练习是否学过(true/false)
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<boolean>} 返回练习是否学过
   */
  async checkStatus(userId: string, exerciseId: string): Promise<boolean> {
    return await ExerciseLearned.findOne(
      { userId: userId, exerciseId: exerciseId }
    ) ? true : false; 
  }

  /**
   * 标记为学过
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回标记后的学习状态
   */
  async createStatus(userId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    const newIsLearned = await ExerciseLearned.create({ userId, exerciseId });
    return newIsLearned ? { isLearned: true } : { isLearned: false };
  }

  /**
   * 标记为未学过
   * @param {string} userId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回标记后的学习状态
   */
  async deleteStatus(userId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    const deletedStatus = await ExerciseLearned.findOneAndDelete({ userId, exerciseId });
    return deletedStatus ? { isLearned: false } : { isLearned: true };
  }
}

export const exeLearnService = new ExeLearnService(); 