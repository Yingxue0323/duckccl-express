import Intro, { IIntro } from '../models/Intro';
import { getSignedUrl } from '../utils/s3';

class IntroService {
 /**
  * 创建intro
  * @param intro (text: string, duration: number, url: string)
  * @returns {Promise<IIntro>} 返回创建的intro的raw信息
  */
  async createIntro(intro: any): Promise<IIntro> {
    const newIntro = await Intro.create(intro);
    return newIntro;
  }

 /**
  * 获取所有intro
  * @returns {Promise<IIntro[]>} 返回所有intro的raw信息
  */
   async getAllIntros(): Promise<IIntro[]> {
    return await Intro.find();
  }

 /**
  * 获取某个intro
  * @param {string} introId - introID
  * @returns {Promise<any>} 返回intro格式后的信息
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

 /**
  * 更新intro
  * @param {string} introId - introID
  * @param {any} intro - intro信息（text: string, duration: number, url: string）
  * @returns {Promise<IIntro>} 返回更新后的intro的raw信息
  */
  async updateIntro(introId: string, intro: any): Promise<IIntro> {
    const updatedIntro = await Intro.findByIdAndUpdate(introId, intro, { new: true });
    if (!updatedIntro) throw new Error('Intro not found');
    return updatedIntro;
  }

  /**
   * 删除intro
   * @param {string} introId - introID
   * @returns {Promise<boolean>} 返回删除成功与否
   */ 
  async deleteIntro(introId: string): Promise<boolean> {
    const deletedIntro = await Intro.findByIdAndDelete(introId);
    if (!deletedIntro) throw new Error('Intro not found');

    return true;
  }
  
}

export const introService = new IntroService(); 