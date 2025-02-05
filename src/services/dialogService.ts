import Dialog, { IDialog } from '../models/Dialog';
import { audioService } from './audioService';

class DialogService {
 /**
  * 创建对话
  * @param dialog 对话对象(exerciseId, sequence: number, audioIds: string[])
  * @returns 创建后的对话对象
  */
  async createDialog(dialog: any): Promise<IDialog> {
    const newDialog = await Dialog.create(dialog);
    return newDialog;
  }

 /**
  * 获取所有对话列表
  * @param userId 用户ID
  * @returns 对话列表
  */
  async getAllDialogs(): Promise<IDialog[]> {
    const dialogs = await Dialog.find();
    return dialogs;
  }

  /**
   * 获取单个对话详情
   * @param dialogId 对话ID
   * @param userId 用户ID
   * @returns 对话详情
   */
  async getDialogById(dialogId: string, userId: string): Promise<{ dialogId: string; sequence: number; audios: any[] }> {
    const dialog = await Dialog.findById(dialogId).lean();
    if(!dialog) throw new Error('Dialog not found');

    const audioList = await Promise.all(
      dialog.audioIds.map(audioId => 
        audioService.getAudioById(audioId.toString(), userId)
      )
    );

    return {
      dialogId: dialog._id.toString(),
      sequence: dialog.sequence,
      audios: audioList
    };
  }

  /**
   * 更新对话
   * @param dialogId 对话ID
   * @param dialog 对话(sequence: number, audioIds: string[])
   * @returns 更新后的对话对象
   */
  async updateDialog(dialogId: string, dialog: any): Promise<boolean> {
    const updatedDialog = await Dialog.findByIdAndUpdate(dialogId, dialog, { new: true });
    if(!updatedDialog) throw new Error('Dialog not found');
    return true;
  }

  /**
   * 删除对话
   * @param dialogId 对话ID
   * @returns 是否删除成功
   */
  async deleteDialog(dialogId: string): Promise<boolean> {
    const dialog = await Dialog.findByIdAndDelete(dialogId);
    if(!dialog) throw new Error('Dialog not found');
    return true;
  }
}

export const dialogService = new DialogService(); 