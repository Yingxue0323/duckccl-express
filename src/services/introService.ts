import Intro from '../models/Intro';
import { getSignedUrl } from '../utils/s3';

class IntroService {

  /**
   * 获取某个intro
   * @param {string} introId - introID
   * @returns {Promise<any>} 返回intro
   */
  async getIntroById(introId: string): Promise<any> {
    const intro = await Intro.findById(introId);
    if (!intro) throw new Error('Intro not found');
    const audio = await getSignedUrl(intro.url);

    return {
      introId: intro._id.toString(),
      text: intro.text,
      audio: audio,
      duration: intro.duration,
    };
  }

}

export const introService = new IntroService(); 