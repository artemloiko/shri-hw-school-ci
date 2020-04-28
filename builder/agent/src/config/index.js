let fileConfig;

try {
  // eslint-disable-next-line global-require
  fileConfig = require('../../agent-conf.json');
} catch (e) {
  const errMessage = e.code === 'MODULE_NOT_FOUND' ? 'is not found' : 'is broken';
  console.log(`File server-conf.json ${errMessage}, trying env variables`);
}

const getEnvConfig = () => {
  const conf = {};
  if (process.env.PORT) conf.port = Number(process.env.PORT);
  if (process.env.SERVER_HOST) conf.serverHost = process.env.SERVER_HOST;
  if (process.env.SERVER_PORT) conf.serverPort = process.env.SERVER_PORT;
  return conf;
};

const envConfig = getEnvConfig();

const config = { ...fileConfig, ...envConfig };

const requiredFileds = ['port', 'serverHost', 'serverPort'];
const missedFields = requiredFileds.filter((field) => config[field] === undefined);

if (missedFields.length) {
  throw new Error(`⚠️  Couldn't find required fields (${missedFields})  ⚠️`);
}

module.exports = config;
