import { useDefaultReversibleCauses } from '@/composables/defaultReversibleCauses';
import { CprEventType, type CprEvent, type CrpState } from '@/types';
import { defineStore } from 'pinia';
import { useCprEventStore } from './cprEvent';

const cprEventStore = useCprEventStore();

export const useCprStateStore = defineStore({
	id: 'cprState',
	state: (): CrpState => ({
		timers: {
			start: 0,
			epinephrine: 0,
			cycle: 0
		},
		cycleLength: 2 * 60 * 1000,
		cycleCount: 1,
		reversibleCauses: useDefaultReversibleCauses()
	}),
	getters: {
		running(state) {
			return state.timers.start > 0;
		}
	},
	actions: {
		cycle() {
			cprEventStore.addNewEvent(CprEventType.Cycle);
			this.timers.cycle = Date.now();
			this.cycleCount++;
		}
	}
});
