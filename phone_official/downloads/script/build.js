import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
//import re from 'rollup-plugin-re'
//import json from 'rollup-plugin-json'
//import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/common.js',
  output: {
    format: 'iife', 
    file: 'dist/bundle.min.js'
  },
  plugins: createPlugins()
}

function createPlugins () {
  return [
    // re({
    //   defines: {
    //     IS_REMOVE: true,
    //   }
    // }),
    // {
    //   name: 'stdx-resolve',
    //   resolveId (id, origin) {
    //     if (id.startsWith('vue')) {
    //       return require.resolve(id)
    //     }
    //   }
    // },
    // json(),
    // vue({
    //   css: true
    // }),
    babel({
      babelrc: false,
      // presets: [
      //   ["env", {
      //     "targets": {
      //       "browsers": ["last 2 versions", "safari >= 7"]
      //     }
      //   }]
      // ]
    }),
    resolve({
      main: true,
      browser: true,
    }),
    commonjs({
      include: [
        'node_modules/**',
        process.env.ENTRYMODULE + '/**',
      ]
    }),
  ]  
}