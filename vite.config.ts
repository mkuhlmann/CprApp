import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: '0.0.0.0'
	},
	plugins: [vue(), VitePWA({
		includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],  
		manifest: {
		  name: 'CRP App',
		  short_name: 'CPR App',
		  description: 'Description of your app',
		  theme_color: '#7f1d1d',
		  icons: [
			{
			  src: 'pwa-192x192.png',
			  sizes: '192x192',
			  type: 'image/png',
			},
			{
			  src: 'pwa-512x512.png',
			  sizes: '512x512',
			  type: 'image/png',
			},
			{
			  src: 'pwa-512x512.png',
			  sizes: '512x512',
			  type: 'image/png',
			  purpose: 'any maskable',
			}
		  ]
		}
	  }), WindiCSS()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
