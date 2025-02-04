import Dialog, { IDialog } from '../models/Dialog';
import { audioService } from './audioService';

class DialogService {
 /**
  * 获取一个练习的所有对话列表
  * @param exerciseId 练习ID
  * @param userId 用户ID
  * @returns 对话列表
  */
  async getDialogsByExerciseId(exerciseId: string, userId: string): Promise<{ exerciseId: string; dialogsCount: number;
    dialogs: { _id: string; sequence: number; audios: any[] }[] }> {
    if (!exerciseId || !userId) {
      throw new Error('Exercise ID and User ID are required');
    }
    
    const dialogs = await Dialog.find({ exerciseId }).sort({ sequence: 1 })
  
    const dialogList = await Promise.all(dialogs.map(async (dialog: IDialog) => {
      const audioList = [];
      for(const audioId of dialog.audioIds) {
        const audio = await audioService.getAudioById(audioId.toString(), userId);
        if(audio) {
          audioList.push(audio);
        }
      }
      return {
        _id: dialog._id.toString(),
        sequence: dialog.sequence,
        audios: audioList,
      };
    }));

    return {
      exerciseId: exerciseId,
      dialogsCount: dialogs.length,
      dialogs: dialogList,
    };
  }

}

export const dialogService = new DialogService(); 