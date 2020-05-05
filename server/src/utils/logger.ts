import { AxiosError } from 'axios';

export function logResponseError(message: string, err: AxiosError) {
  let errorResponse;
  if (err.response) {
    const { status, statusText, headers, data } = err.response;
    errorResponse = { status, statusText, headers, data };
  }
  const error = {
    message: err.message,
    stack: err.stack,
    response: errorResponse,
  };
  console.error(message, error);
}
