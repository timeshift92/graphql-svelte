import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup';
export default {
  input: 'src/index.js',
  output: [{
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/graphql-svelte.js' ,
  },{
    sourcemap: true,
    format: 'esm',
    name: 'app',
    file: 'dist/graphql-svelte.esm.js' ,
  }
],
  plugins: [

    resolve({
      browser: true,
    }),
    cleanup(),
    commonjs(),
    terser(),
  ],

}


