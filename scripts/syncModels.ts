import { connect, connection } from 'mongoose';
import User from '../src/models/User';
import Exercise from '../src/models/Exercise';
import ExerciseFavorite from '../src/models/ExerciseFavorite';
import ExerciseLearned from '../src/models/ExerciseLearned';
import Redeem from '../src/models/Redeem';
// import SaticContent from '../src/models/SaticContent';
import Audio from '../src/models/Audio';
import AudioFavorite from '../src/models/AudioFavorite';
import UserPractice from '../src/models/UserPractice';
import Word from '../src/models/Word';
import WordFavorite from '../src/models/WordFavorite';
import WordLearning from '../src/models/WordLearning';
import logger from '../src/utils/logger';
import { config } from '../src/configs/index';

async function syncAllModels() {
  try {
    await connect(config.mongodb.uri || '');
    logger.info('已连接到数据库');

    // 所有模型的列表
    const models = [
      // Exercise,
      // ExerciseFavorite,
      // ExerciseLearned,
      Redeem,
    //   SaticContent,
      User,
      UserPractice,
      // Audio,
      // AudioFavorite,
      // Word,
      // WordFavorite,
      // WordLearning,
    ];

    // 同步每个模型
    for (const model of models) {
      logger.info(`正在同步 ${model.modelName}...`);
      
      try {
        // 1. 删除现有索引
        await model.collection.dropIndexes();
        logger.info(`- 已删除旧索引`);
        
        // 2. 重新创建索引
        await model.syncIndexes();
        logger.info(`- 已创建新索引`);
        
        // 3. 更新所有文档
        const result = await model.updateMany(
          {},
          { $set: { updatedAt: new Date() } },
          { runValidators: true }
        );
        
        logger.info(`- 已更新 ${result.modifiedCount} 个文档`);
        
      } catch (error) {
        logger.error(`同步 ${model.modelName} 失败:`, error);
      }
    }

    logger.info('所有模型同步完成');
    process.exit(0);
    
  } catch (error) {
    logger.error('同步失败:', error);
    process.exit(1);
  }
}

// 运行同步
if (require.main === module) {
  syncAllModels().catch(console.error);
}