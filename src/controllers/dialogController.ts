import { Request, Response } from 'express';
import { dialogService } from '../services/dialogService';
import logger from '../utils/logger';

class DialogController {
  // 创建对话
  async createDialog(req: Request, res: Response) {
    try {
      const dialog = await dialogService.createDialog(req.body);
      return res.json(dialog);
    } catch (error: any) {
      logger.error(`创建对话失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '创建对话失败' });
    }
  }

  // 获取所有对话列表
  async getAllDialogs(req: Request, res: Response) {
    try {
      const dialogs = await dialogService.getAllDialogs();
      logger.info(`获取所有对话成功: ${dialogs.length}`);
      return res.json(dialogs);

    } catch (error: any) {
      logger.error(`获取所有对话失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '获取所有对话失败' });
    }
  }

  // 获取单个对话详情
  async getDialogById(req: Request, res: Response) {
    try {
      const dialogId = req.params.id;
      const userId = req.user.id;
      const dialog = await dialogService.getDialogById(dialogId, userId);

      logger.info(`获取对话成功: ${dialogId}`);
      return res.json(dialog);
    } catch (error: any) {
      logger.error(`获取对话失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '获取对话失败' });
    }
  }

  // 更新对话
  async updateDialog(req: Request, res: Response) {
    try {
      const dialogId = req.params.id;
      const dialog = await dialogService.updateDialog(dialogId, req.body);

      logger.info(`更新对话成功: ${dialogId}`);
      return res.json(dialog);
    } catch (error: any) {
      logger.error(`更新对话失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '更新对话失败' });
    }
  } 
  
  // 删除对话
  async deleteDialog(req: Request, res: Response) {
    try {
      const dialogId = req.params.id;
      const dialog = await dialogService.deleteDialog(dialogId);

      logger.info(`删除对话成功: ${dialogId}`);
      return res.json({ message: '删除对话成功' });
    } catch (error: any) {
      logger.error(`删除对话失败: ${JSON.stringify({ error: error.message })}`);
      return res.status(500).json({ error: '删除对话失败' });
    }
  }
}
export const dialogController = new DialogController();