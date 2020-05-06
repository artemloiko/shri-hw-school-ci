import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const isProd = process.env.NODE_ENV === 'production';

export default {
  input: 'src/serviceWorker/sw.ts',
  output: {
    file: isProd ? 'temp/sw.js' : 'public/sw.js',
    format: 'es',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    typescript({
      tsconfig: 'src/serviceWorker/tsconfig.json',
    }),
    resolve(),
    terser(),
  ],
};
