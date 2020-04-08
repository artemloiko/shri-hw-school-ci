import { withNaming } from '@bem-react/classname';

export const cn = (blockName, props) => {
  const cnBem = withNaming({ e: '__', m: '_', v: '_' });
  const { mods = {}, mix = [], className = '' } = props;
  const cnMods = cnBem(blockName)(mods);
  let cnMix = '';
  if (mix.length) {
    cnMix = mix.map((mixBlock) => cnBem(mixBlock, blockName)()).join(' ');
  }
  return `${className} ${cnMods} ${cnMix}`.trim();
};
