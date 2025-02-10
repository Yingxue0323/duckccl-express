import { generateToken } from '../src/utils/jwt';
import { config } from '../src/configs';

// 确保有 JWT_SECRET
if (!config.jwt.secret) {
  console.error('Error: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const token = generateToken('67962207cde721d7ea0d6e78');
console.log('Generated token:', token);