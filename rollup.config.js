
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import sass from 'rollup-plugin-sass';
import {uglify} from 'rollup-plugin-uglify';
import {version} from './package.json';

const widgetName = 'Telex';
const year = new Date().getFullYear();

const banner = `
/*!
 * ${widgetName} ${version}
 * (c) ${year} sjaakpriester.nl
 */
`;

const outro = `exports.version = '${version}';`;

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/telex.js',
        format: 'iife',
        name: widgetName,
        sourcemap: true,
        globals: {
      //      lodash: '_'
        },
        banner: banner,
        outro: outro,
      //  extend: true
    },
    plugins: [
        resolve({
            jsnext: true,
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        commonjs(),
        json(),
        sass({
            insert: true,
            options: {
                outputStyle: 'compressed'
            }
        }),
        buble({
             transforms: {
                 modules: false,
                 dangerousForOf: true,
                 dangerousTaggedTemplateString: true
             }
        }),
        uglify({
            output: {
                 comments: /^!/
            }
        })
    ],
    external: [
 //       'lodash'
    ]
};
