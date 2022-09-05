// import typescript froyarn m 'rollup-plugin-typescript2'
import typescript from '@rollup/plugin-typescript';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {visualizer} from 'rollup-plugin-visualizer'
import summary from "rollup-plugin-summary";

const packageJson = require('./package.json');

export default ({
    input: `src/index.ts`,
    output: [{
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
    }, {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
    }],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        typescript({
            declaration: true,
            declarationDir: `./dist`
        }),
        summary(),
        visualizer(),
    ]
})
