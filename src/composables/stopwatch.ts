import { useInterval } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

const computedTime = function (elapsed: Ref<number>, showHours: boolean = false) {
	const hours = computed(() => Math.floor(elapsed.value / 1000 / 3600));
	const minutes = computed(() => Math.floor(elapsed.value / 1000 / 60 % 60));	
	const seconds = computed(() => Math.floor(elapsed.value / 1000 % 60));

	const formatted = computed(() => {
		const h = hours.value.toString().padStart(2, '0');
		const m = minutes.value.toString().padStart(2, '0');
		const s = seconds.value.toString().padStart(2, '0');
		return (showHours) ? `${h}:${m}:${s}` : `${m}:${s}`;
	});

	return {
		seconds,
		minutes,
		hours,
		formatted
	};
}

export const useStopwatch = function (precision: number = 1000, showHours: boolean = false) {
	let elapsed = ref(0);
	let running = ref(false);
	let interval: number;

	const start = () => {
		running.value = true;
		interval = setInterval(() => {
			elapsed.value += precision;
		}, precision);	
	};

	const pause = () => {
		running.value = false;
		clearInterval(interval);
	};

	const reset = () => {
		elapsed.value = 0;
	};

	return {
		running,
		start,
		pause,
		reset,
		elapsed,
		...computedTime(elapsed, showHours)
	}
};