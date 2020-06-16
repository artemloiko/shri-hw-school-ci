import { formatTime } from '../../utils/formatTime';
import i18n, { TFunction } from 'i18next';

describe('formatTime', () => {
  let t: TFunction;
  beforeAll(async () => {
    t = await i18n.init();
  });

  test('returns formated duration with only seconds', () => {
    const duration = formatTime(30, t);

    expect(duration).toBe('30 sec');
  });
  test('returns formated duration with only minutes', () => {
    const duration = formatTime(600, t);

    expect(duration).toBe('10 min');
  });
  test('returns formated duration with hours and minutes', () => {
    const duration = formatTime(6000, t);

    expect(duration).toBe('1 h 40 min');
  });
});
