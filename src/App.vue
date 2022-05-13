<script setup lang="ts">
import { useDark, useWakeLock } from '@vueuse/core';
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAnalytics } from './composables/analytics';

const isDark = useDark({
	selector: 'html',
});

const wakeLock = useWakeLock();

onMounted(() => {
	wakeLock.request('screen').then();
	useAnalytics();
});

</script>

<template>
	<RouterView />
</template>

<style>
body {
    font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}

.link {
	@apply underline underline-dotted hover:underline-solid;
}
    
</style>
