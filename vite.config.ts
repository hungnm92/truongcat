import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Tách thư viện ra file riêng để trình duyệt cache lâu dài.
        codeSplitting: {
          groups: [
            { name: 'astro', test: /node_modules[\\/](iztro|lunar-lite|lunar-typescript|dayjs)/ },
            { name: 'lunar', test: /node_modules[\\/]lunar-javascript/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
})
