import User from '../models/User';

function generateRandomCode(length: number): string {
  const min = Math.max(5000, Math.pow(10, length - 1));
  const max = Math.pow(10, length) - 1;
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum.toString();
}

// Generate unique user code
export async function generateUniqueUserCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    const length = Math.floor(Math.random() * 3) + 7;  // 7-9位
    const code = generateRandomCode(length);
    
    // check if the code is already used
    const existingUser = await User.findOne({ userCode: code });
    if (!existingUser) {
      return code;
    }
    
    attempts++;
  }
  
  // If multiple attempts fail, use timestamp + random number
  const timestamp = Date.now().toString().slice(-9);
  const num = parseInt(timestamp);
  return Math.max(num, 5000).toString();
} 