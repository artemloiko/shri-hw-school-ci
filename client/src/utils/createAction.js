/**
 * Create FSA (flux standart action);
 * @param {string} type
 * @param {*} payload
 * @param {boolean} error
 * @param {*} meta
 */
export function createAction(type, payload, error, meta) {
  const FSA = { type };
  if (payload) FSA.payload = payload;
  if (error) FSA.error = error;
  if (meta) FSA.meta = meta;
  return FSA;
}
