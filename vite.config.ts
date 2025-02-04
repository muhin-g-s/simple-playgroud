import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import wasm from 'vite-plugin-wasm'

// https://vite.dev/config/ы
export default defineConfig({
  plugins: [
		react(),
		nodePolyfills({
      include: ['buffer', 'path', 'stream', 'util', 'process'], 
    }),
		wasm(),
	],
	define: {
    global: 'globalThis', 
  },
})
