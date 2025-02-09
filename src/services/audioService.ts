import Audio, { IAudio } from '../models/Audio';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
import { getSignedUrl } from '../utils/s3';

class AudioService {
 /**
  * 创建音频
  * @param audio 音频对象(sequence: number, englishContent: {url: string, duration: number, text: string}, contents: {language: {url: string, duration: number, text: string}})
  * @returns 创建后的音频对象
  */
  async createAudio(audio: any): Promise<IAudio> {
    const newAudio = await Audio.create(audio);
    return newAudio;
  }

 /**
  * 获取所有音频列表
  * @param userId 用户ID
  * @returns 音频列表
  */
  async getAllAudios(): Promise<IAudio[]> {
    const audios = await Audio.find();
    return audios;
  }

 /**
  * 获取单个音频详情
  * @param audioId 音频ID
  * @param userId 用户ID
  * @returns 音频详情(可直接播放的url)
  */
  async getAudioById(audioId: string, userId: string): Promise<{
    audioId: string; sequence: number; isFavorite: boolean; englishText: string; englishUrl: string; 
    englishDuration: number; translatedText: string; translatedUrl: string; translatedDuration: number; }> {
    if (!audioId || !userId) throw new Error('Audio ID and User ID are required');

    const [audio, isFavorite, userLang] = await Promise.all([
      Audio.findById(audioId),
      exeFavService.checkFavStatusByAudioId(userId, audioId), // 是否收藏，返回boolean
      userService.getUserLang(userId)
    ]);
    if (!audio || !userLang) throw new Error('Audio not found');

    const englishUrl = await getSignedUrl(audio.englishContent.url);

    const content = audio.contents.get(userLang);
    if (!content) throw new Error(`No content found for language: ${userLang}`);

    const translatedUrl = await getSignedUrl(content.url);

    return {
      audioId: audio._id.toString(),
      sequence: audio.sequence,
      isFavorite: isFavorite,

      englishText: audio.englishContent.text,
      englishUrl: englishUrl,
      englishDuration: audio.englishContent.duration,

      translatedText: content.text,
      translatedUrl: translatedUrl,
      translatedDuration: content.duration,
    };
  }

 /**
  * 更新音频
  * @param audioId 音频ID
  * @param audio 音频(sequence: number, englishContent/contents: {url: string, duration: number, text: string})
  * @returns 更新后的音频对象
  */
  async updateAudio(audioId: string, audio: any): Promise<boolean> {
    const updatedAudio = await Audio.findByIdAndUpdate(audioId, audio, { new: true });
    if(!updatedAudio) throw new Error('Audio not found');
    return true;
  }

 /**
  * 删除音频
  * @param audioId 音频ID
  * @returns 是否删除成功
  */
  async deleteAudio(audioId: string): Promise<boolean> {
    const audio = await Audio.findByIdAndDelete(audioId);
    if(!audio) throw new Error('Audio not found');
    return true;
  }
}

export const audioService = new AudioService(); 