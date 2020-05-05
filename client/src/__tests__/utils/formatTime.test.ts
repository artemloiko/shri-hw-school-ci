import { formatTime } from '../../utils/formatTime';

describe('formatTime', () => {
  test('returns formated duration with only seconds', () => {
    const duration = formatTime(30);

    expect(duration).toBe('30 sec');
  });
  test('returns formated duration with only minutes', () => {
    const duration = formatTime(600);

    expect(duration).toBe('10 min');
  });
  test('returns formated duration with hours and minutes', () => {
    const duration = formatTime(6000);

    expect(duration).toBe('1 h 40 min');
  });
});
