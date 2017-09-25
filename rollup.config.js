import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'
import browsersync from 'rollup-plugin-browsersync'

const production = process.env.NODE_ENV === 'production'
const folders = ['example', 'dist']

export default [{
  entry: 'src/index.js',
  dest: pkg.browser,
  format: 'umd',
  moduleName: 'creepyFace',
  plugins: [
    resolve({browser: true}),
    commonjs(),
    babel(),
    production && uglify(),
    !production && browsersync({server: folders, files: folders})
  ]
}, {
  entry: 'src/index.js',
  external: Object.keys(pkg.dependencies),
  plugins: [babel()],
  targets: [{
    dest: pkg.main,
    format: 'cjs'
  }, {
    dest: pkg.module,
    format: 'es'
  }]
}]
