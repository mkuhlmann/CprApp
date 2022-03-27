import { CprEventType, type CprEvent } from '@/types';
import { defineStore } from 'pinia';

export const useCprStore = defineStore({
	id: 'cpr',
	state: () => ({
		running: false,
		cycleLength: 2 * 60 * 1000,
		events: [] as CprEvent[]
	}),
	getters: {

	},
	actions: {
		start() {
			this.running = true;
		},
		addEvent(event: CprEvent) {
			this.events.push(event);
		},
		addNewEvent(type: string, text?: string) {
			this.addEvent({
				type,
				time: Date.now() / 1000 | 0,
				text
			});
		},
		cycle() {
			this.addNewEvent(CprEventType.Cycle);
		}
	}
});