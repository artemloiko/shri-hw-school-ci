import dotenv from 'dotenv';
const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
process.env.REPO_PATH = 'repo';

const config = {
  nodeEnv: process.env.NODE_ENV,
  storageApikey: process.env.STORAGE_API_KEY,
  port: process.env.PORT || '3001',
  repoPath: process.env.REPO_PATH,
  storageURL: process.env.STORAGE_URL || 'https://hw.shri.yandex/api',
};

if (!config.storageApikey) {
  throw new Error('STORAGE_API_KEY is required');
}

export default config;
