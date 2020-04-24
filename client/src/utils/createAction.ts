export interface FSA<T, K> {
  type: string;
  payload?: T;
  error?: boolean;
  meta?: K;
}

/**
 * Create FSA (flux standart action);
 */
export function createAction<T, K = any>(
  type: string,
  payload: T,
  isError: boolean,
  meta: K,
): FSA<T, K> {
  const FSA: FSA<T, K> = { type };
  if (payload) FSA.payload = payload;
  if (isError) FSA.error = isError;
  if (meta) FSA.meta = meta;
  return FSA;
}
