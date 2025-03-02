import Audio, { IAudio } from '../models/Audio';
import { userService } from './userService';
import { audioFavService } from './audioFavService';
import Exercise from '../models/Exercise';

class AudioService {

  /**
   * 创建新的音频，admin only，不处理返回格式
   * @param {any} data - 音频对象，包含音频的exerciseId, order, text, language, url, duration, (trans_text, trans_url, trans_duration)
   * @returns {Promise<any>} 返回创建后的音频对象
   */
  async createAudio(data: any): Promise<any> {
    const audio = await Audio.create(data);
    await audio.save();
    return { audio };
  }

  /**
   * 获取所有音频，user profile -> favorite audios进入，允许筛选favorite和限定页数
   * 需要进行vip_check，只显示can_play
   * @param {string} openId - 用户ID
   * @param {number} page - 页码
   * @param {number} page_size - 每页数量
   * @param {boolean} favorite - 是否收藏
   * @returns {Promise<any>} 返回音频总数、已学数量、收藏数量和音频简要信息列表
   */
  async getAllAudios(openId: string, page: number = 1, page_size: number = 25, favorite?: boolean): Promise<any> {
    if (!openId) {
      throw new Error('User is required');
    }
    
    // 页数处理
    if (page < 1) page = 1;
    if (page_size < 1) page_size = 25;
    const skip = (page - 1) * page_size; // 计算跳过的记录数

    // 并行异步
    const [audios, favoritesList, isUserVIP] = await Promise.all([
      Audio.find()
        .sort({ createdAt: -1 }) // 按收藏时间降序排序
        .skip(skip)
        .limit(page_size)
        .lean(),
      audioFavService.getAllFavoriteAudios(openId), // 返回收藏的audioId列表
      userService.checkVIPStatus(openId),
    ]);
    const favoriteSet = new Set(favoritesList.ids);

    // 根据 favorite 筛选音频
    let filteredAudios = audios;
    if (favorite == true) {
      filteredAudios = audios.filter(audio => favoriteSet.has(audio._id.toString()));
    }

    // 获取所有VIPOnly的练习
    const VIPExercises = await Exercise.find({isVIPOnly: true}).select('_id').lean();
    const VIPExercisesSet = new Set(VIPExercises.map(exe => exe._id.toString()));

    const audioList = filteredAudios.map((audio: any) => {
      const audioId = audio._id.toString();
      // 如果用户不是VIP，并且音频对应的练习是VIPOnly，则不显示音频
      if (!isUserVIP && VIPExercisesSet.has(audio.exerciseId)) {
        return {
          _id: audioId,
          is_audio_favorite: favoriteSet.has(audioId),
          can_play: false,
        };
      }
      return {
        ...audio,
        can_play: true,
        is_audio_favorite: favoriteSet.has(audioId),
      };
    });
    // 返回带统计值的
    return {
      current_page: page,
      total_pages: Math.ceil(audios.length / page_size),
      audio_count: audios.length,
      favorite_count: favoritesList.count,
      audios: audioList,
    };
  }

  /**
   * 获取练习中所有音频，exercise -> 进入，无需vip check
   * @param {string} openId - 用户ID
   * @param {string} exerciseId - 练习ID
   * @returns {Promise<any>} 返回音频列表，包含is_audio_favorite、can_play属性
   */
  async getAudiosByExerciseId(openId: string, exerciseId: string): Promise<any> {
    if (!openId || !exerciseId) throw new Error('User open ID and Exercise ID are required');

    // 1. 获取当前练习中所有音频(已经过vip筛选)
    const audios = await Audio.find({ exerciseId })
      .sort({ order: 1 })
      .select('order language text url duration trans_text trans_url trans_duration')
      .lean();
    if (!audios) throw new Error('Audios not found');

    // 2. 获取当前练习中所有已收藏的audio的id集合
    const audioIds = audios.map(audio => audio._id.toString());
    const favoriteAudios = await audioFavService.getFavoriteAudiosByIds(openId, audioIds);
    const favoriteAudioSet = new Set(favoriteAudios);

    // 3. 处理audio列表，添加属性并移除order
    const audioList = audios.map(audio => {
      const { order, ...audioWithoutOrder } = {
        ...audio,
        is_audio_favorite: favoriteAudioSet.has(audio._id.toString())
      };
      return audioWithoutOrder;
    });

    const formattedAudios = {
      intro: audioList.find((_, index) => audios[index].order === 0),
      dialogs: audioList.filter((_, index) => audios[index].order !== 0)
    };

    return formattedAudios;
  }

  /**
   * 获取单个音频详情, use profile -> favorite audios -> audio 进入，无需vip check
   * @param {string} audioId - 音频ID
   * @param {string} openId - 用户ID
   * @returns {Promise<any>} 返回音频详情, 包含is_audio_favorite、can_play属性
   */
  async getAudioById(audioId: string, openId: string): Promise<any> {
    if (!audioId || !openId) throw new Error('Audio ID and User ID are required');

    const audio = await Audio.findById(audioId).lean();
    if (!audio) throw new Error('Audio not found');

    const [isUserVIP, isExeVIPOnly, isAudioFavorite] = await Promise.all([
      userService.checkVIPStatus(openId),
      Exercise.findById(audio.exerciseId).select('isVIPOnly').lean(),
      audioFavService.checkFavStatusByAudioId(openId, audioId)
    ]);

    if (!isUserVIP && isExeVIPOnly) {
      return {
        _id: audioId,
        is_audio_favorite: isAudioFavorite,
        can_play: false,
      };
    }

    return {
      _id: audioId,
      is_audio_favorite: isAudioFavorite,
      can_play: true,
      order: audio.order,

      text: audio.text,
      url: audio.url,
      duration: audio.duration,

      trans_text: audio.trans_text,
      trans_url: audio.trans_url,
      trans_duration: audio.trans_duration,
    };
  }

  /**
   * 更新音频 - 仅管理员使用，不做返回格式处理
   * @param {string} audioId - 音频ID
   * @param {any} audio - order, text, url, duration, trans, trans_url, trans_duration
   * @returns {Promise<any>} 返回更新后的音频对象
   */
  async updateAudio(audioId: string, data: any): Promise<{updatedAudio: IAudio}> {
    const updatedAudio = await Audio.findByIdAndUpdate(audioId, data);
    if (!updatedAudio) throw new Error('Audio not found');
    return { updatedAudio }
  }

  /**
   * 删除音频 - 仅管理员使用，不做返回格式处理
   * @param {string} audioId - 音频ID
   * @returns {Promise<any>} 返回删除成功与否的boolean
   */
  async deleteAudio(audioId: string): Promise<boolean> {
    const deletedAudio = await Audio.findByIdAndDelete(audioId);
    if (!deletedAudio) throw new Error('Audio not found');
    return true;
  }
}

export const audioService = new AudioService(); 