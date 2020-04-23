const dotenv = require('dotenv');
const findConfig = require('find-config');

const envFile = process.env.NODE_TEST === 'test' ? '.env.test' : '.env';
const envFound = dotenv.config({ path: findConfig(envFile) });

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.REPO_PATH = 'repo';

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || '3000',
  storageURL: process.env.STORAGE_URL,
  storageApikey: process.env.STORAGE_API_KEY,
  repoPath: process.env.REPO_PATH,
};
