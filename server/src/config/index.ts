import dotenv from 'dotenv';
import findConfig from 'find-config';

const envFile = process.env.NODE_TEST === 'test' ? '.env.test' : '.env';
const pathToEnv = findConfig(envFile) || envFile;
const envFound = dotenv.config({ path: pathToEnv });

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.REPO_PATH = 'repo';

const config = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || '3000',
  storageURL: process.env.STORAGE_URL,
  storageApikey: process.env.STORAGE_API_KEY,
  repoPath: process.env.REPO_PATH,
};

export default config;
