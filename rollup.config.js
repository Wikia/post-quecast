import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

const pkg = require('./package.json');

/**
 * Adds @__PURE__ to every instance (class, const method etc.) to allow tree shaking
 * @returns {{renderChunk(string): {code: string, map: null}}}
 */
export function markAsPure() {
  return {
    renderChunk(code) {
      return {
        code: code.replace(/^(var .+) = /gm, (match) => match.replace(' = ', ' = /*@__PURE__*/ ')),
        map: null,
      };
    },
  };
}

const commonPlugins = [
  // Allow json resolution
  json(),
  // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
  commonjs(),
  // Allow node_modules resolution, so you can use 'external' to control
  // which external modules to include in the bundle
  nodeResolve(),
  // Generate a minified bundle with terser
  terser(),
];

// Indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'rxjs/operators',
];

const targets = {
  esm: {
    input: 'src/index.ts',
    output: { file: pkg.module, format: 'esm', sourcemap: true },
    watch: { include: 'src/**' },
    external,
    plugins: [
      ...commonPlugins,
      typescript({ compilerOptions: { declaration: true, declarationDir: 'dist/types' } }),
      markAsPure(),
    ],
  },
  cjs: {
    input: 'src/index.ts',
    output: { file: pkg.main, format: 'cjs', sourcemap: true },
    watch: { include: 'src/**' },
    external,
    plugins: [...commonPlugins, typescript()],
  },
};

export default Object.values(targets);
