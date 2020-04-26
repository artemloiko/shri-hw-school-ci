import { cn } from '../../utils/bem-cn';

describe('cn', () => {
  test('generate className with block name withour params', () => {
    const className = cn('block', {});

    expect(className).toBe('block');
  });
  test('generate className with mixes specified', () => {
    const className = cn('block', { mix: ['mix1', 'mix2'] });

    expect(className).toBe('block mix1__block mix2__block');
  });
  test('generate className with mods specified', () => {
    const className = cn('block', { mods: { active: true, size: 's' } });

    expect(className).toBe('block block_active block_size_s');
  });
  test('generate className with mods and mixes specified', () => {
    const className = cn('block', { mix: ['mix'], mods: { active: true, size: 's' } });

    expect(className).toBe('block block_active block_size_s mix__block');
  });
});
