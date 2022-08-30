/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import { renderer } from 'unplugin-auto-expose';
import commonjsExternals from 'vite-plugin-commonjs-externals';
import builtinModules from 'builtin-modules';

const PACKAGE_ROOT = __dirname;

const commonjsPackages = [
  'electron',
  'electron/main',
  'electron/common',
  'electron/renderer',
  ...builtinModules,
];

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      'sharedProcess/': join(PACKAGE_ROOT, 'src') + '/',
      'main/': join(PACKAGE_ROOT, '../main/src') + '/',
      'render/': join(PACKAGE_ROOT, '../render/src') + '/',
      'base/': join(PACKAGE_ROOT, '../base') + '/',
      'platform/': join(PACKAGE_ROOT, '../platform') + '/',
    },
  },
  base: '',
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      input: join(PACKAGE_ROOT, 'index.html'),
    },
    emptyOutDir: true,
    brotliSize: false,
  },
  plugins: [
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    commonjsExternals({
      externals: commonjsPackages,
    }),
  ],
};

export default config;
