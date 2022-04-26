import { fileURLToPath, URL } from 'url'
import { VitePWA } from 'vite-plugin-pwa'
import WindiCSS from 'vite-plugin-windicss';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: '0.0.0.0',
		/* hmr: {
			clientPort: 443,
			host: 'dde-3000.pve.mkuhlmann.org'
		}*/
	},
	plugins: [vue(), vueI18n({
		include: path.resolve(__dirname, './src/locales/**'),
	}),
	VitePWA({
		registerType: 'autoUpdate',
		includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
		manifest: {
			name: 'CRP Timer',
			short_name: 'CPR Timer',
			description: 'CPR Timer supports medical professionals during during cardiopulmonary resuscitation (CPR) and advanced life support (ALS).',
			theme_color: '#7f1d1d',
			start_url: '/',
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
