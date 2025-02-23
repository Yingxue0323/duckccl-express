import ExerciseLearned from '../models/ExerciseLearned';

class ExeLearnService {
  /**
   * 获取所有学过的练习题id列表和数量
   * @param {string} openId - 用户ID
   * @returns {Promise<{count: number, ids: string[]}>} 返回学过的练习题id列表和数量
   */
  async getAllLearnedExercises(openId: string): Promise<{count: number, ids: string[]}> {
    const learnedList = await ExerciseLearned.find({openId}).select('exerciseId').lean();
    return {
      count: learnedList.length,
      ids: learnedList.map(item => item.exerciseId.toString())
    }
  }

  /**
   * 获取单个练习是否学过(true/false)
   * @param {string} openId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<boolean>} 返回练习是否学过
   */
  async checkLearningStatus(openId: string, exerciseId: string): Promise<boolean> {
    return await ExerciseLearned.findOne({ openId, exerciseId }) ? true : false; 
  }

  /**
   * 标记为学过
   * @param {string} openId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回标记后的学习状态
   */
  async createStatus(openId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    const newIsLearned = await ExerciseLearned.create({ openId, exerciseId });
    return newIsLearned ? { isLearned: true } : { isLearned: false };
  }

  /**
   * 标记为未学过
   * @param {string} openId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回标记后的学习状态
   */
  async deleteStatus(openId: string, exerciseId: string): Promise<{isLearned: boolean}> {
    const deletedStatus = await ExerciseLearned.findOneAndDelete({ openId, exerciseId });
    return deletedStatus ? { isLearned: false } : { isLearned: true };
  }
}

export const exeLearnService = new ExeLearnService(); 