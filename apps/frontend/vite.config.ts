import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
// https://vitejs.dev/config/
// export default defineConfig({

// });
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: isDev
    ? {
        host: true,
        // https: isDev
        //   ? {
        //       key: fs.readFileSync(
        //         path.resolve(__dirname, "subhadips-macbook-pro.local+3-key.pem")
        //       ),
        //       cert: fs.readFileSync(
        //         path.resolve(__dirname, "subhadips-macbook-pro.local+3.pem")
        //       ),
        //     }
        //   : false,
        proxy: {
          '/api': {
            // target: 'http://192.168.1.13:8080/',
            target: 'http://localhost:8080/',
            // changeOrigin: true,
            // rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      }
    : undefined,
});
