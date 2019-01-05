import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'
import browsersync from 'rollup-plugin-browsersync'

const production = process.env.NODE_ENV === 'production'

export default [
  {
    input: 'dist/creepyface.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'creepyface'
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      resolve({ browser: true }),
      commonjs(),
      production && uglify(),
      !production && browsersync({ server: ['test', '.'] })
    ]
  },
  {
    input: 'dist/creepyface.js',
    external: Object.keys(pkg.dependencies),
    plugins: [babel({ exclude: 'node_modules/**' })],
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ]
  }
]
