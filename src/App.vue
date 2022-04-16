<script setup lang="ts">
import { useDark, useWakeLock } from '@vueuse/core';
import { onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const isDark = useDark({
	selector: 'html',
});

const wakeLock = useWakeLock();

onMounted(() => {
	wakeLock.request('screen').then();
});

</script>

<template>
	<RouterView />
</template>

<style>
body {
    font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
}
    
</style>
