import type { CprEvent } from '@/types';
import { defineStore } from 'pinia';

export const useCprEventStore = defineStore({
	id: 'cprEvent',
	state: () => ({
		events: [] as CprEvent[]
	}),
	getters: {

	},
	actions: {
		addEvent(event: CprEvent) {
			this.events.push(event);
		},
		addNewEvent(type: string, text?: string) {
			this.addEvent({
				type,
				time: Date.now() / 1000 | 0,
				text
			});
		}
	}
});