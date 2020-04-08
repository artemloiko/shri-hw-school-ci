/**
 * Create FSA (flux standart action);
 * @param {string} type
 * @param {*} payload
 * @param {boolean} error
 * @param {*} meta
 */
export function createAction(type, payload, error = false, meta = null) {
  const FSA = { type, payload, error };
  if (meta) FSA.meta = meta;
  return FSA;
}
