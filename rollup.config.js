import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    uglify(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: ['@babel/core'],
};
