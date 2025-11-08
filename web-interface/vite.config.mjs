import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
      rollupOptions: {
        plugins: [nodePolyfills()],
      },
    },
    define: {
      'process.env': {},
      global: 'globalThis',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@wallet',
          replacement: path.resolve(__dirname, 'src/components/wallet'),
        },
        {
          find: '@js',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: 'buffer',
          replacement: 'buffer/',
        },
        {
          find: 'process',
          replacement: 'process/browser',
        },
        {
          find: 'stream',
          replacement: 'stream-browserify',
        },
        {
          find: 'crypto',
          replacement: 'crypto-browserify',
        },
        {
          find: 'util',
          replacement: 'util/',
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['sevenstime-backoffice.local'],
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8090',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
        },
      },
    },
  }
})
