function logError(...args) {
  console.error('\x1b[31m%s\x1b[0m', '[ERROR]', ...args);
}

function logWarning(...args) {
  console.warn('\x1b[33m%s\x1b[0m', '[WARNING]', ...args);
}

function logInfo(...args) {
  console.log('\x1b[94m%s\x1b[0m', '[INFO]', ...args);
}

module.exports = {
  error: logError,
  warn: logWarning,
  info: logInfo,
};
