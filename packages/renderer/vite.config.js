/* eslint-env node */

import { chrome } from '../../.electron-vendors.cache.json';
import { join } from 'path';
import vue from '@vitejs/plugin-vue2';
import { renderer } from 'unplugin-auto-expose';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      '/@/': join(PACKAGE_ROOT, 'src') + '/',
      'main/': join(PACKAGE_ROOT, '../main/src') + '/',
      'render/': join(PACKAGE_ROOT, 'src') + '/',
      'base/': join(PACKAGE_ROOT, '../base') + '/',
      'sharedProcess/': join(PACKAGE_ROOT, '../sharedProcess/src') + '/',
      'platform/': join(PACKAGE_ROOT, '../platform') + '/',
    },
  },
  base: '',
  server: {
    fs: {
      strict: true,
    },
  },
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
  test: {
    environment: 'happy-dom',
  },
  plugins: [
    vue(),
    renderer.vite({
      preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'assets')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
};

export default config;
