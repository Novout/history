import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import vueGlobalComponent  from "unplugin-vue-components/vite"
import Unocss from 'unocss/vite'
import { presetWind, presetUno } from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  plugins: [
    vue(), 
    vueGlobalComponent({
      dirs: ['src/ui'],
      dts: true
    }),
    Unocss({
      presets: [
        presetUno(),
        presetWind(),
        presetWebFonts({
          provider: 'google',
          fonts: {
            poppins: 'Poppins',
            raleway: 'Raleway',
          },
        }) as any,
      ],
      rules: [
        ['bg-blur', { 'backdrop-filter': 'blur(10px)', 'background-color': 'rgba(0, 0, 0, 0.3)' }],
        ['bg-blur-button', { 'backdrop-filter': 'blur(10px)', 'background-color': 'rgba(0, 0, 0, 0.5)' }],
      ]
    }),
  ],
  build: {
    emptyOutDir: true,
    minify: 'esbuild'
  },
})
