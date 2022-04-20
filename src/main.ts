import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { registerSW } from 'virtual:pwa-register';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

import i18nMessages from '@/locales';
import App from './App.vue';

import { createRouter, createWebHistory } from 'vue-router';

import './assets/base.css';
import 'virtual:windi.css';
import { useNavigatorLanguage } from '@vueuse/core';

dayjs.extend(dayjsDuration);

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})


const i18n = createI18n({
	locale: useNavigatorLanguage().language.value,
	fallbackLocale: 'en',
	legacy: false,
	globalInjection: true,
	messages: i18nMessages
})


const app = createApp(App)

app.use(createPinia());
app.use(i18n);

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('./views/CprView.vue')
		}
	]
})
app.use(router);

app.mount('#app')
