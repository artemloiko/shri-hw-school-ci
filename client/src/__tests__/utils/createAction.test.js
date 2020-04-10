import { createAction } from '../../utils/createAction';

describe('createAction', () => {
  test('create action with only type', () => {
    const action = createAction('ACTION_TYPE');

    expect(action).toEqual({ type: 'ACTION_TYPE' });
  });
  test('create action with payload', () => {
    const action = createAction('ACTION_TYPE', 'payload');

    expect(action).toEqual({ type: 'ACTION_TYPE', payload: 'payload' });
  });
  test('create action with payload and meta', () => {
    const action = createAction('ACTION_TYPE', 'payload', false, 'meta');

    expect(action).toEqual({ type: 'ACTION_TYPE', payload: 'payload', meta: 'meta' });
  });
  test('create action with error', () => {
    const action = createAction('ACTION_TYPE', 'error', true);

    expect(action).toEqual({ type: 'ACTION_TYPE', payload: 'error', error: true });
  });
  test('create action with error and meta', () => {
    const action = createAction('ACTION_TYPE', 'error', true, 'meta');

    expect(action).toEqual({ type: 'ACTION_TYPE', payload: 'error', error: true, meta: 'meta' });
  });
});
