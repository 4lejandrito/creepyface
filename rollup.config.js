import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'
import browsersync from 'rollup-plugin-browsersync'

const production = process.env.NODE_ENV === 'production'
const folders = ['example', 'dist']

export default [{
  input: 'src/index.js',
  output: {
    file: pkg.browser,
    format: 'umd',
    name: 'creepyFace'
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    resolve({browser: true}),
    commonjs(),
    production && uglify(),
    !production && browsersync({server: folders, files: folders})
  ]
}, {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies),
  plugins: [babel({ exclude: 'node_modules/**' })],
  output: [{
    file: pkg.main,
    format: 'cjs'
  }, {
    file: pkg.module,
    format: 'es'
  }]
}]
