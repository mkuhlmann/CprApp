import type { CprEvent } from '@/types';
import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useCprEventStore = defineStore('cprEvent', () => {
	const events = useStorage('cprEvent', [] as CprEvent[]);

	const addEvent = (event: CprEvent) => {
		events.value.push(event);
	};

	const addNewEvent = (type: string, text?: string)  => {
		addEvent({
			type,
			time: Date.now() / 1000 | 0,
			text
		});
	};

	const reset = () => {
		events.value = [];
	};

	return {
		events,
		addEvent,
		addNewEvent,
		reset
	};
});