// import typescript froyarn m 'rollup-plugin-typescript2'
import typescript from '@rollup/plugin-typescript';

import resolve from '@rollup/plugin-node-resolve';
import depsExternal from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {visualizer} from 'rollup-plugin-visualizer'
import summary from "rollup-plugin-summary";

export default ({
    input: `src/index.ts`,
    output: {
        dir: `dist/`,
        format: 'esm',
        sourcemap: true,
    },
    plugins: [
        json(),
        depsExternal(),
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
