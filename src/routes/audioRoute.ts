import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authMiddleware } from '../middlewares/authMW';

const router = Router();

router.get('/', authMiddleware, exerciseController.getAudio); // 音频流式传输

export default router; 
