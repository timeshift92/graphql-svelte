import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/grpahql-svelte.js' ,
  },
  plugins: [

    resolve({
      browser: true,
    }),
    commonjs(),
    terser(),
  ],
}


