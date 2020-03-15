/* eslint-disable max-classes-per-file */
class HttpError extends Error {
  // ENUM errorCode = [GIT_CANNOT_FIND_BRANCH, GIT_CANNOT_FIND_REPO]
  constructor(message, status = 500, errorCode) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

module.exports = {
  HttpError,
};
