import User from '../models/User';

function generateRandomCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';  
  const letter1 = letters[Math.floor(Math.random() * letters.length)];
  const letter2 = letters[Math.floor(Math.random() * letters.length)];
  
  const number = Math.floor(1000 + Math.random() * 9000);
  
  return `${letter1}${letter2}${number}`;
}

async function generateTimeBasedCode(): Promise<string> {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let attempts = 0;
  
  while (attempts < 100) {  // 时间戳策略也需要重试机制
    const timestamp = Date.now();
    const letter1 = letters[timestamp % letters.length];
    const letter2 = letters[(timestamp / 1000) % letters.length];
    const numbers = (timestamp % 10000).toString().padStart(4, '0');
    const code = `${letter1}${letter2}${numbers}`;
    
    const existingUser = await User.findOne({ userCode: code });
    if (!existingUser) {
      return code;
    }
    
    attempts++;
    // 短暂延迟以获取不同的时间戳
    await new Promise(resolve => setTimeout(resolve, 1));
  }
  
  // 如果时间戳策略也失败了，抛出错误
  throw new Error('无法生成唯一用户码，请通知管理员');
}

// Generate unique user code
export async function generateUniqueUserCode(): Promise<string> {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';  
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const code = generateRandomCode();
    
    const existingUser = await User.findOne({ userCode: code });
    if (!existingUser) {
      return code;
    }
    
    attempts++;
  }
  
  // 如果随机策略失败，使用时间戳策略
  return generateTimeBasedCode();
} 