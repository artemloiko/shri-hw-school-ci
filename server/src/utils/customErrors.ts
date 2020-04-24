export enum ErrorCode {
  'GIT_CANNOT_FIND_BRANCH',
  'GIT_CANNOT_FIND_REPO',
  'GIT_CANNOT_FIND_COMMIT',
}

export class HttpError extends Error {
  status: number;
  errorCode: ErrorCode;
  constructor(message: string, status = 500, errorCode: ErrorCode) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}
