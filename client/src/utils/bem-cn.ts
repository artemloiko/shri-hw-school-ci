import { withNaming } from '@bem-react/classname';

export interface CNMods {
  [mod: string]: string | boolean | undefined;
}

export interface CNProps<T extends CNMods = {}> {
  className?: string;
  mix?: string[];
  mods?: T;
}

export function cn<T extends CNMods>(blockName: string, props: CNProps<T>): string {
  const cnBem = withNaming({ e: '__', m: '_', v: '_' });
  const { mods = {}, mix = [], className = '' } = props;
  const cnMods = cnBem(blockName)(mods);
  let cnMix = '';
  if (mix.length) {
    cnMix = mix.map((mixBlock) => cnBem(mixBlock, blockName)()).join(' ');
  }
  return `${className} ${cnMods} ${cnMix}`.trim();
}
