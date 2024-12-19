import { Client } from 'minio';
const credentials = {
  url: process.env.MINIO_URL || 'undefined',
  accessKey: process.env.MINIO_ACCESS_KEY || 'undefined',
  secretKey: process.env.MINIO_SECRET_KEY || 'undefined',
};

const minioClient = new Client({
  endPoint: new URL(credentials.url).hostname,
  port: parseInt(new URL(credentials.url).port) || 80,
  useSSL: new URL(credentials.url).protocol === 'https:',
  accessKey: credentials.accessKey,
  secretKey: credentials.secretKey,
});

export default minioClient; 