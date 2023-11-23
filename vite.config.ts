import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
      modules: {
        generateScopedName: '[local]-[hash:base64:5]',
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            'primary-color': '#13C2C2',
            'border-radius-base': '6px',
            'font-size-base': '14px',
          },
        },
      },
    },

    resolve: {
      alias: {
        '@@': path.resolve(__dirname),
        '@': path.resolve(__dirname, 'src'),
        '~antd': 'node_modules/antd',
      },
    },
    server: {
      cors: true,
      port: process.env.VITE_PORT as unknown as number,
      proxy: {
        '/admin': {
          target: env.VITE_APP_TARGET_URL,
          changeOrigin: true,
          secure: false,
        },
        '/audience': {
          target: 'https://audience.stg.g123.jp.private',
          // target: 'http://localhost:8080',
          rewrite: (path) => path.replace(/^\/audience/, ''),
          changeOrigin: true,
          secure: false,
        },
        '/oauth2': {
          target: 'https://event-admin.stg.g123.jp',
          changeOrigin: true,
          secure: false,
        },
      },
      // To avoid not being able to hot reload, need to set the protocol and path manually
      hmr: {
        protocol: 'ws',
        host: '127.0.0.1',
      },
    },
    build: {
      target: 'esnext',
    },
  };
});
