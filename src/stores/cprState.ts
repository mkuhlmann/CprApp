import { useDefaultReversibleCauses } from '@/composables/defaultReversibleCauses';
import { CprEventType, type CprState } from '@/types';
import { computed } from '@vue/reactivity';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { useCprEventStore } from './cprEvent';

const generateIdAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const generateId = function() {
	let id = '';
	for (let i = 0; i < 4; i++) {
		id += generateIdAlphabet[Math.floor(Math.random() * generateIdAlphabet.length)];
	}
	return id;
};

export const useCprStateStore = defineStore('cprState', () => {
	const cprEventStore = useCprEventStore();
	
	const state : Ref<CprState> = useStorage('cprState', {
		id: '',
		timers: {
			start: 0,
			epinephrine: 0,
			cycle: 0
		},
		cycleLength: 2 * 60 * 1000,
		cycleCount: 1,
		reversibleCauses: useDefaultReversibleCauses(),
		running: false
	});

	const running = computed(() => {
		return state.value.running &&
			state.value.timers.start + 1000 * 60 * 60 * 12 > Date.now() &&
			(state.value.timers.epinephrine == 0 || state.value.timers.epinephrine + 1000 * 60 * 60 > Date.now());
	});

	const cycle = () => {
		state.value.timers.cycle = Date.now();
		state.value.cycleCount++;
	};

	const start = () => {
		reset();
		cprEventStore.reset();

		state.value.id = generateId();
		state.value.running = true;

		cprEventStore.addNewEvent(CprEventType.Start);
		state.value.timers.start = Date.now();
		state.value.timers.cycle = Date.now();
	};

	const reset = () => {
		state.value.timers = {
			start: 0,
			epinephrine: 0,
			cycle: 0
		};
		state.value.reversibleCauses = useDefaultReversibleCauses();
		state.value.cycleCount = 1;
		state.value.id = '';
	};

	return {
		state,
		start,
		running,
		cycle,
		reset
	}
});


