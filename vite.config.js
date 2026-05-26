import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        digital: resolve(__dirname, 'src/digital/index.html'),
        digitalPrivacy: resolve(__dirname, 'src/digital/privacy.html'),
        digitalTerms: resolve(__dirname, 'src/digital/terms.html'),
        atelier: resolve(__dirname, 'src/atelier/index.html'),
        edu: resolve(__dirname, 'src/edu/index.html')
      }
    }
  },
  server: {
    port: 3000
  }
})