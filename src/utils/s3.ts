import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl as awsGetSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../configs/index';
import logger from './logger';

const s3Client = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.aws.accessKey,
    secretAccessKey: config.aws.secretAccessKey,
  }
});

/**
 * 获取S3对象的预签名URL
 * @param objectKey - S3中的对象键（文件路径）
 * @param expiresIn - URL有效期（秒）
 * @returns 预签名URL
 */
export async function getSignedUrl(objectKey: string, expiresIn: number = 900): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.s3.bucketName,
    Key: objectKey,
  });

  try {
    const signedUrl = await awsGetSignedUrl(s3Client, command, { expiresIn });
    logger.info(`获取S3预签名URL成功: ${signedUrl}，有效期: ${expiresIn}秒`);
    return signedUrl;
  } catch (error: any) {
    logger.error(`获取S3预签名URL失败: ${error.message}`);
    throw new Error('获取S3音频访问链接失败');
  }
} 