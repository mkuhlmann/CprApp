<script lang="ts" setup>
import dayjs from 'dayjs';
const props = withDefaults(defineProps<{ duration: number, format: string }>(), {
	format: 'HH:ss'
});
</script>

<template>
	<span class="font-mono">{{ dayjs.duration(props.duration).format(props.format) }}</span>
</template>
