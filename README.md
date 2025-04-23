# Duck CCL Express Backend

A robust Express.js backend service for an English translation practice platform, built with TypeScript and MongoDB Atlas(Cloud).

## Features

- 🔐 User Authentication & Authorization
  - WeChat Mini Program login integration
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - VIP membership system

- 📚 Core Functionalities
  - Word learning and practice
  - Translation exercises
  - Audio content management
  - Favorite system for words and exercises
  - Learning progress tracking
  - Invitation code system for VIP access

- 🛠 Technical Features
  - RESTful API design
  - MongoDB Atlas integration
  - AWS S3 for file storage
  - Automated cleanup tasks
  - Comprehensive logging system
  - Type-safe development with TypeScript

## Prerequisites

- Node.js (v20+)
- MongoDB
- npm or yarn
- AWS Account (for S3 storage)
- WeChat Mini Program Developer Account

## Installation

1. Clone the repository
```bash
git clone https://github.com/Yingxue0323/duckccl-express.git
cd duckccl-express
```

2. Install dependencies
```bash
nvm use 20  # Use Node.js v20
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
ADMIN_SECRET_KEY=your_admin_secret
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_REGION=your_s3_region
S3_BUCKET_NAME=your_bucket_name
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
```

4. Start development server
```bash
npm run dev
```

## Project Structure

```
src/
├── configs/         # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
├── models/          # MongoDB models
├── routes/          # API routes
├── services/        # Business logic
├── tasks/           # Background tasks
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Deployment

The project uses PM2 for process management in production:

```bash
# Build TypeScript files
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

## Background Tasks

The project includes an automated cleanup task that runs weekly to remove expired:
- User tokens
- Invitation codes

Configure the cleanup schedule in `ecosystem.config.js`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
