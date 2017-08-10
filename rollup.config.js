import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

const production = process.env.NODE_ENV === 'production';

export default {
    entry : 'src/index.js',
    dest : 'public/bundle-rollup.js',
    format : 'iife',
    plugins : [
        postcss({extensions: ['.css']}),
        resolve(),
        commonjs(),
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
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        production && uglify()
    ]
};
