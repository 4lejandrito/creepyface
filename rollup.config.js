import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import pkg from './package.json';

const production = process.env.NODE_ENV === 'production';

const compilePlugins = [
    postcss({extensions: ['.css']}),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
            [
                'es2015', {
                    modules: false
                }
            ],
            'stage-0',
            'react'
        ],
        plugins: ['external-helpers']
    })
];

export default[
    {
        entry : 'src/index.js',
        dest : pkg.browser,
        format : 'umd',
        plugins : compilePlugins.concat([
            resolve(),
            commonjs(),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            production && uglify()
        ])
    }, {
        entry : 'src/index.js',
        external : Object.keys(pkg.dependencies),
        plugins : compilePlugins,
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
