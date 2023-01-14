import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

export default {
  input: 'client/index.js',
  output: {
    file: 'client/shortcuts.js',
    format: 'iife',
    globals: {
      input: 'input'
    },
    sourcemap: true
  },
  plugins: [commonjs(), resolve(), terser()]
}