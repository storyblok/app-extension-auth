import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import commonjs from '@rollup/plugin-commonjs'
import { visualizer } from 'rollup-plugin-visualizer'
import json from '@rollup/plugin-json'
import filesize from 'rollup-plugin-filesize'

import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageJsonPath = join(
  dirname(fileURLToPath(import.meta.url)),
  './package.json',
)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

/** @type {import('rollup').RollupOptions} */
export default {
  input: `./src/index.ts`,
  output: [
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    json(),
    commonjs(),
    typescript(),
    visualizer(),
    filesize(),
  ],
}
