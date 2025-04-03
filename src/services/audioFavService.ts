import AudioFavorite from '../models/AudioFavorite';
import Exercise from '../models/Exercise';
import Audio from '../models/Audio';

class AudioFavService {
 /**
  * 获取用户所有收藏的音频id列表和数量
  * @param {string} openId - 用户ID
  * @returns {any} 返回收藏id列表和数量
  */
  async getAllFavoriteAudios(openId: string): Promise<{count: number, ids: string[]}> {
    const favoriteList = await AudioFavorite.find({openId: openId})
      .sort({ createdAt: -1 })
      .select('audioId exerciseTitle exerciseSeq').lean();
    return {
      count: favoriteList.length,
      ids: favoriteList.map(item => item.audioId)
    }
  }

  /**
   * 获取指定音频List中所有已收藏的音频ID
   * @param {string} openId - 用户ID
   * @param {string[]} audioIds - 音频ID列表
   * @returns {Promise<string[]>} 返回收藏的音频ID列表
   */
  async getFavoriteAudiosByIds(openId: string, audioIds: string[]): Promise<string[]> {
    const favorites = await AudioFavorite.find({
      openId: openId,
      audioId: { $in: audioIds }
    }).select('audioId').lean();
    return favorites.map(fav => fav.audioId);
  }

 /**
  * 查看某音频是否收藏
  * @param {string} openId - 用户ID
  * @param {string} audioId - 音频ID
  * @returns {Promise<boolean>} 返回是否收藏
  */
  async checkFavStatusByAudioId(openId: string, audioId: string): Promise<boolean> {
    const favoriteStatus = await AudioFavorite.findOne({ openId: openId, audioId: audioId });
    return favoriteStatus ? true : false;
  }

 /**
  * 收藏音频
  * @param {string} openId - 用户ID
  * @param {string} audioId - 音频ID
  * @returns {Promise<{isAudioFavorite: boolean}>} 返回更新后的收藏状态
  */
  async favoriteAudio(openId: string, audioId: string): Promise<{isAudioFavorite: boolean}> {
    // 检查是否已存在收藏
    const existingFavorite = await AudioFavorite.findOne({openId: openId, audioId: audioId});
    // 如果不存在，则获取相关练习信息，新增音频收藏
    if (!existingFavorite) {
      const audio = await Audio.findById(audioId);
      const exercise = await Exercise.findById(audio?.exerciseId);
      if (!exercise) throw new Error('Related exercise not found, please verify the audioId');
      
      await AudioFavorite.create({ 
        openId: openId, 
        audioId: audioId, 
        exerciseTitle: exercise.title, 
        exerciseSeq: exercise.seq 
      });
    }

    return { isAudioFavorite: true };
  }

  /**
   * 取消收藏音频
   * @param {string} openId - 用户ID
   * @param {string} audioId - 音频ID
   * @returns {Promise<{isAudioFavorite: boolean}>} 返回是否取消收藏
   */
  async unfavoriteAudio(openId: string, audioId: string): Promise<{isAudioFavorite: boolean}> {
    // 如果存在，则删除收藏
    await AudioFavorite.findOneAndDelete({ openId, audioId });
    return { isAudioFavorite: false };
  }
}

export const audioFavService = new AudioFavService(); 