import { defineConfig } from 'vite'
import {resolve, dirname} from 'path'
import {fileURLToPath} from 'url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'app/src/main.tsx'),
      name: 'crm',
      fileName: 'main',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    global: {},
  }
})