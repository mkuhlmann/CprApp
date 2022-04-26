<script setup lang="ts">
import { useCprStateStore } from '@/stores/cprState';
import { useRouter } from 'vue-router';
import Footer from '../components/Footer.vue';

const router = useRouter();
const cprStateStore = useCprStateStore();

const start = function () {
	cprStateStore.start();
	router.push('/' + cprStateStore.state.id);
};
</script>

<template>
	<div class="lg:w-1/2 mx-auto flex flex-col items-center py-10 gap-5">

		<div>
			<img src="/logo.svg" width="400" height="400" alt="CPR App Logo" />
		</div>

		<div class="w-full">
			<button v-on:click="start" class="button w-full py-4 bg-green-600 hover:bg-green-500 text-white">Start</button>
		</div>

		<div>
			<p>
				<span class="italic text-xl">{{ $t('text.hero') }}</span>
			</p>
			<p class="mt-5">
				<ul class="list-disc pl-5">
					<li>{{ $t('features.timers') }}</li>
					<li>{{ $t('features.protocol') }}</li>
					<li>{{ $t('features.hts') }}</li>
					<li>{{ $t('features.rhythm') }}</li>
				</ul>
			</p>
		</div>

		<Footer />
	</div>
</template>