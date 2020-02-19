import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const extensions = ['.js', '.ts']

export default [
  {
    input: 'src/index.ts',
    external: ['creepyface'],
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'creepyface-firefly',
      globals: { creepyface: 'creepyface' }
    },
    plugins: [
      resolve({ extensions, browser: true }),
      commonjs(),
      babel({ extensions }),
      uglify()
    ]
  }
]
