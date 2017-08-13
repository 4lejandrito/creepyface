import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const production = process.env.NODE_ENV === 'production';
const babelPlugin = babel({
    exclude: ['node_modules/!(zen-observable)/**']
});

export default[
    {
        entry : 'src/index.js',
        dest : pkg.browser,
        format : 'umd',
        moduleName: 'creepyFace',
        plugins : [
            babelPlugin,
            resolve({browser: true}),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            production && uglify()
        ]
    }, {
        entry : 'src/index.js',
        external : Object.keys(pkg.dependencies),
        plugins : [babelPlugin],
        targets : [
            {
                dest: pkg.main,
                format: 'cjs'
            }, {
                dest: pkg.module,
                format: 'es'
            }
        ]
    }
];
