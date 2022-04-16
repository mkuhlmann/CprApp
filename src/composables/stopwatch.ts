import { useInterval } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

export const useStopwatch = function (precision: number = 1000, showHours: boolean = false) {
	let startTs = ref(0);
	let elapsed = ref(0);
	let running = ref(false);
	let interval: number;

	const start = () => {
		reset();
		running.value = true;
		interval = setInterval(() => {
			elapsed.value = Date.now() - startTs.value;
		}, precision);	
	};

	const pause = () => {
		running.value = false;
		clearInterval(interval);
	};

	const reset = () => {
		startTs.value = Date.now();
	};

	return {
		running,
		start,
		pause,
		reset,
		elapsed
	}
};