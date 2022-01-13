import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'build/timwoods-bf-lib.js',
      format: 'system',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.rollup.json', module: 'esnext' }),
    /* postcss(), */
    terser(),
    serve({
      headers: {
        'Access-Control-Allow-Origin': 'https://laxbx.timwoods.cloud',
      },
    }),
    livereload({ watch: './sre' }),
  ],
};
