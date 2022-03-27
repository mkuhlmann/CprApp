import { useInterval } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

const computedTime = function (elapsed: Ref<number>) {
	const hours = computed(() => Math.floor(elapsed.value / 1000 / 3600));
	const minutes = computed(() => Math.floor(elapsed.value / 1000 / 60 % 60));	
	const seconds = computed(() => Math.floor(elapsed.value / 1000 % 60));

	const formatted = computed(() => {
		const h = hours.value.toString().padStart(2, '0');
		const m = minutes.value.toString().padStart(2, '0');
		const s = seconds.value.toString().padStart(2, '0');
		return `${h}:${m}:${s}`;
	});

	return {
		seconds,
		minutes,
		hours,
		formatted
	};
}

export const useStopwatch = function (precision: number = 1000) {
	let elapsed = ref(0);
	let interval: number;

	const start = () => {
		interval = setInterval(() => {
			elapsed.value += precision;
		}, 10);//precision);	
	};

	const pause = () => {
		clearInterval(interval);
	};

	const reset = () => {
		elapsed.value = 0;
	};

	return {
		start,
		pause,
		reset,
		elapsed,
		...computedTime(elapsed)
	}
};