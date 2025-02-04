import Audio, { IAudio } from '../models/Audio';
import { exeFavService } from './exeFavService';
import { userService } from './userService';
import { getSignedUrl } from '../utils/s3';

class AudioService {
  // 获取对话音频列表
  async getAudiosByDialogId(dialogId: string, userId: string): Promise<any> {
    if (!dialogId || !userId) {
      throw new Error('Dialog ID and User ID are required');
    }
    
    const [userLang, audios] = await Promise.all([
      userService.getUserLang(userId),
      Audio.find({ dialogId }).sort({ sequence: 1 })
    ]);

    const audioList = await Promise.all(audios.map(async (audio: IAudio) => {
      const content = audio.englishContent;
      const translatedContent = audio.contents.get(userLang);
      
      if (!translatedContent) {
        throw new Error(`No translated content found for language: ${userLang}`);
      }
      
      const signedUrl = await getSignedUrl(translatedContent.url);
      const isFavorite = exeFavService.checkFavStatusById(userId, audio._id.toString());
      
      return {
        sequence: audio.sequence,
        englishContent: content,
        translatedContent: translatedContent,
        url: signedUrl,
        isFavorite: isFavorite
      };
    }));

    // 返回带统计值的
    return {
      dialogId: dialogId,
      audioCount: audios.length,
      audios: audioList,
    };
  }

 /**
  * 获取单个音频详情
  * @param audioId 音频ID
  * @param userId 用户ID
  * @returns 音频详情(可直接播放的url)
  */
  async getAudioById(audioId: string, userId: string): Promise<{
    _id: string; sequence: number; isFavorite: boolean; englishText: string; englishUrl: string; 
    englishDuration: number; translatedText: string; translatedUrl: string; translatedDuration: number; }> {
    if (!audioId || !userId) {
      throw new Error('Audio ID and User ID are required');
    }

    const [audio, isFavorite, userLang] = await Promise.all([
      Audio.findById(audioId),
      exeFavService.checkFavStatusById(userId, audioId), // 是否收藏，返回boolean
      userService.getUserLang(userId)
    ]);
    if (!audio || !userLang) {
      throw new Error('Audio not found');
    }

    const englishUrl = await getSignedUrl(audio.englishContent.url);

    const content = audio.contents.get(userLang);
    if (!content) {
      throw new Error(`No content found for language: ${userLang}`);
    }
    const translatedUrl = await getSignedUrl(content.url);

    return {
        _id: audio._id.toString(),
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

  // 更新收藏状态
  async updateFavoriteStatus(userId: string, audioId: string, isFavorite: boolean): Promise<any> {
    return exeFavService.updateFavoriteStatus(userId, audioId, 'Audio', isFavorite);
  }

  //----------------------------------管理员----------------------------------
  // 创建音频
  async createAudio(audio: IAudio): Promise<any> {
    const newAudio = await Audio.create(audio);
    return {
      message: 'CREATE_AUDIO_SUCCESS',
      audio: newAudio
    }
  }

  // 更新音频
  async updateAudio(audio: IAudio): Promise<any> {
    const updatedAudio = await Audio.findByIdAndUpdate(
      audio._id, 
      audio, 
      { new: true }
    );
    return {
      message: 'UPDATE_AUDIO_SUCCESS',
      audio: updatedAudio
    }
  }

  // 删除音频
  async deleteAudio(audioId: string): Promise<any> {
    await Audio.findByIdAndDelete(audioId);
    return {
      message: 'DELETE_AUDIO_SUCCESS',
      audioId: audioId
    }
  }
}

export const audioService = new AudioService(); 