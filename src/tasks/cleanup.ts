import mongoose from 'mongoose';
import Token from '../models/Token';
import Redeem from '../models/Redeem';

async function cleanup() {
  try {
    console.log('开始清理过期数据...');
    
    // 清理过期的 token
    const tokenResult = await Token.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    const redeemResult = await Redeem.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    
    console.log(`清理完成: 删除了 ${tokenResult.deletedCount} 条token过期记录`);
    console.log(`清理完成: 删除了 ${redeemResult.deletedCount} 条redeem过期记录`);
    
    // 退出进程
    process.exit(0);
  } catch (error) {
    console.error('清理失败:', error);
    process.exit(1);
  }
}

// 连接数据库并执行清理
mongoose.connect(process.env.MONGODB_URI!)
  .then(cleanup)
  .catch(error => {
    console.error('数据库连接失败:', error);
    process.exit(1);
  });