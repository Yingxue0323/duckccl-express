import Intro from '../models/Intro';
import { getSignedUrl } from '../utils/s3';

class IntroService {
  /**
   * 获取一个练习的intro
   * @param {string} exerciseId - 练习ID
   * @param {string} userId - 用户ID
   * @returns {Promise<any>} 返回intro
   */
  async getIntroByExeId(exerciseId: string, userId: string): 
   Promise<{introId: string, exerciseId: string, text: string, audio: string, duration: number}> {
    if (!exerciseId || !userId) {
      throw new Error('Exercise ID and User ID are required');
    }
    
    const intro = await Intro.findOne({ exerciseId });

    if (!intro) {
      throw new Error('Intro not found');
    }
    const signedUrl = await getSignedUrl(intro.url);

    return {
      introId: intro._id.toString(),
      exerciseId: exerciseId,
      text: intro.text,
      audio: signedUrl,  // 前端直接audio.play()即可
      duration: intro.duration,
    };
  }

  // 获取某个intro
  async getIntroById(introId: string): Promise<any> {
    const intro = await Intro.findById(introId);

    if (!intro) {
      throw new Error('Intro not found');
    }

    return intro;
  }

}

export const introService = new IntroService(); 