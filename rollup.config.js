import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup';
import babel from 'rollup-plugin-babel';
import gzipPlugin from 'rollup-plugin-gzip';
export default {
  input: 'src/index.js',
  output: [{
    sourcemap: true,
    format: 'umd',
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
    babel({
      babelrc: false,
      extensions: ['.js','.mjs', '.jsx', '.es6', '.es', '.mjs', '.html', '.svelte'],
      exclude: [
        // 'node_modules/core-js/**',
        'node_modules/babel-runtime/**',
        'node_modules/@babel/runtime/**',
      ],
      runtimeHelpers: true,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            debug: false,
            // useBuiltIns: 'usage',
            // corejs: 3,
            // shippedProposals: true,
            forceAllTransforms: false,
            targets: {
              browsers: [
                'Firefox >= 70, FirefoxAndroid  >= 70, Chrome >= 70, ChromeAndroid >= 70, Safari >= 12, iOS >= 12',
              ],
            },
          },
        ],
      ],
      plugins: [
        ["@babel/plugin-proposal-class-properties"],
        ["@babel/plugin-transform-object-assign"],
        ["@babel/plugin-transform-runtime",{
          "absoluteRuntime": false,
          "corejs": false,
          "helpers": true,
          "regenerator": true,
          "useESModules": true,
        }],
        ['@babel/plugin-syntax-dynamic-import', {}],
      ],
    }),
    commonjs(),

    terser(),
    gzipPlugin(),
  ],

}


