import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { visualizer } from 'rollup-plugin-visualizer'
import summary from 'rollup-plugin-summary'
import json from '@rollup/plugin-json'
import pkg from './package.json'

const externalPackages = [
  ...Object.keys(pkg.peerDependencies ?? {}),
  ...Object.keys(pkg.dependencies ?? {}),
]
// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(/.*)?`),
)

/** @type {import('rollup').RollupOptions} */
export default {
  input: `./src/index.ts`,
  external: regexesOfPackages,
  output: [
    {
      format: 'commonjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      dir: 'dist',
      entryFileNames: '[name].cjs',
      sourcemap: true,
    },
    {
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      dir: 'dist',
      entryFileNames: '[name].mjs',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    json(),
    commonjs(),
    typescript(),
    summary(),
    visualizer(),
  ],
}
