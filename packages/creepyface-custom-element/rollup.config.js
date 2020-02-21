import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const extensions = ['.js']

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'creepyface-custom-element'
    },
    plugins: [
      resolve({ extensions, browser: true }),
      commonjs(),
      babel({ extensions }),
      uglify()
    ]
  }
]
