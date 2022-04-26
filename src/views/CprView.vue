<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { Howl } from 'howler';
import dayjs from 'dayjs';

import SyringeIcon from '@vicons/fluent/Syringe24Regular';
import CycleIcon from '@vicons/fluent/ArrowRepeatAll24Filled';
import HeartPulseIcon from '@vicons/fluent/HeartPulse24Regular';
import ShockIcon from '@vicons/fluent/Flash24Regular';
import { Icon } from '@vicons/utils';

import { CprEventType } from '@/types';
import { useCprStateStore } from '@/stores/cprState';
import { useCprEventStore } from '@/stores/cprEvent';
import BeepMp3 from '@/assets/beep.mp3';

import DurationDisplay from '@/components/DurationDisplay.vue';
import ReversibleCause from '@/components/ReversibleCause.vue';
import { useTitle } from '@vueuse/core';
import Footer from '../components/Footer.vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const beepSound = new Howl({
	src: [BeepMp3],
	loop: false
});
const { t } = useI18n();
const router = useRouter();
const documentTitle = useTitle();

const cprStateStore = useCprStateStore();
const cprEventStore = useCprEventStore();

const cycleDue = ref(false);
const durations = reactive<Record<string, number>>({});

const uiLocked = ref(false);

const lockUi = function () {
	uiLocked.value = true;
	setTimeout(() => {
		uiLocked.value = false;
	}, 5000);
};

const cycle = () => {
	cycleDue.value = false;
	cprEventStore.addNewEvent(CprEventType.Cycle);
	cprStateStore.cycle();
	lockUi();
	loop();
};

const epinephrine = () => {
	cprStateStore.state.timers.epinephrine = Date.now();
	cprEventStore.addNewEvent(CprEventType.Medication, 'Epinephrine 1 mg');
	loop();
};

const amiodarone = () => {
	cprEventStore.addNewEvent(CprEventType.Medication, 'Amiodarone 300 mg');
	loop();
};

const rhythm = (rhythm: string) => {
	cprEventStore.addNewEvent(CprEventType.Rhythm, rhythm);
};

const shock = () => {
	cprEventStore.addNewEvent(CprEventType.Shock);
};

const rosc = () => {
	rhythm('rosc');
};

const stop = (skipOverview: boolean = false) => {
	cprEventStore.addNewEvent(CprEventType.End);
	if(skipOverview && confirm(t('stop-without-save-confirm'))) {
		cprStateStore.reset();
		cprEventStore.reset();
		router.push('/');
	}
};

const disableButton = function (event: MouseEvent) {
	let el = event.currentTarget as HTMLElement;
	el.setAttribute('disabled', '');
	setTimeout(() => {
		el.removeAttribute('disabled');
	}, 3000);
};

const startLoop = function () {
	const interval = setInterval(() => {
		loop();
	}, 1000);
};

const loop = function () {
	const now = Date.now();

	for (let timer in cprStateStore.state.timers) {
		if (cprStateStore.state.timers[timer] <= 0) {
			durations[timer] = -1;
		} else {
			durations[timer] = now - cprStateStore.state.timers[timer];
		}
	}

	if (durations.cycle > 0) {
		documentTitle.value = `CPR Timer - ${dayjs.duration(durations.cycle).format('mm:ss')} (${cprStateStore.state.cycleCount})`;
	}

	if (!cycleDue.value && durations.cycle > cprStateStore.state.cycleLength) {
		cycleDue.value = true;
		beepSound.play();
	}
};

startLoop();
loop();


</script>

<template>
	<main>
		<div class="lg:w-1/2 mx-auto flex flex-col items-center py-10 gap-5">
			<table class="table text-center">
				<thead>
					<tr>
						<th>{{ $t('epinephrine') }}</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<DurationDisplay :duration="durations.epinephrine" format="mm:ss" />
						</td>
						<td>
							<DurationDisplay :duration="durations.start" format="HH:mm:ss" />
						</td>
					</tr>
				</tbody>
			</table>

			<div class="text-8xl font-bold" v-bind:class="{ 'text-red-500': cycleDue }">
				<DurationDisplay :duration="durations.cycle" format="mm:ss" />
			</div>

			<div class="w-full" v-if="cprStateStore.running">
				<div class="flex justify-center mt-3 mb-1 uppercase font-semibold">{{ $t('cycle') }}: {{ cprStateStore.state.cycleCount }}</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center flex-col md:flex-row">
					<button class="button button-full bg-blue-600 hover:bg-blue-400 py-4 text-white" v-on:click="cycle(); disableButton($event);">
						<Icon>
							<CycleIcon />
						</Icon>
						{{ $t('cycle') }}
					</button>
					<button class="button button-full bg-red-600 hover:bg-red-400 py-4 text-white" v-on:click="epinephrine(); disableButton($event);">
						<Icon>
							<SyringeIcon />
						</Icon>
						{{ $t('epinephrine') }}
					</button>

					<button class="button button-full bg-violet-600 hover:bg-violet-400 py-4 text-white" v-on:click="shock(); disableButton($event);">
						<Icon>
							<ShockIcon />
						</Icon>
						{{ $t('shock') }}
					</button>
					<button class="button button-full bg-red-600 hover:bg-red-400 py-4 text-white" v-on:click="amiodarone(); disableButton($event);">
						<Icon>
							<SyringeIcon />
						</Icon>
						{{ $t('amiodarone') }}
					</button>

				</div>
				<div class="flex justify-center mt-3 mb-1 uppercase font-semibold">{{ $t('rhythm') }}</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center flex-col md:flex-row">
					<button class="button button-full bg-green-600 hover:bg-green-400 text-white" v-on:click="rhythm('pea'); disableButton($event);">
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('pea') }}
					</button>
					<button class="button button-full bg-green-600 hover:bg-green-400 text-white" v-on:click="rhythm('asystole'); disableButton($event);">
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('asystole') }}
					</button>
					<button class="button button-full bg-amber-600 hover:bg-amber-400 text-white" v-on:click="rhythm('vt'); disableButton($event);">
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vt') }}
					</button>
					<button class="button button-full bg-amber-600 hover:bg-amber-400 text-white" v-on:click="rhythm('vf'); disableButton($event);">
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vf') }}
					</button>
				</div>
				<button class="mt-3 button button-full  bg-blue-600 hover:bg-blue-400 text-white" v-on:click="rosc(); disableButton($event);">
					<Icon>
						<HeartPulseIcon />
					</Icon>
					{{ $t('rosc') }}
				</button>

				<div class="flex justify-center mt-3 mb-1 uppercase font-semibold">{{ $t('reversible-causes') }}</div>

				<div class="md:flex">
					<div class="md:flex-1">
						<ReversibleCause v-for="reversibleCause in cprStateStore.state.reversibleCauses.filter(e => e.name.startsWith('H'))" :reversible-cause="reversibleCause" />
					</div>
					<div class="md:flex-1">
						<ReversibleCause v-for="reversibleCause in cprStateStore.state.reversibleCauses.filter(e => e.name.startsWith('T'))" :reversible-cause="reversibleCause" />
					</div>
				</div>



				<div class="flex justify-center mt-3 mb-1 uppercase font-semibold">{{ $t('log') }}</div>

				<table class="table w-full">
					<thead>
						<tr>
							<th>{{ $t('type') }}</th>
							<th></th>
							<th>{{ $t('time') }}</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="event in cprEventStore.events">
							<td class="text-sm">{{ $t(event.type) }}</td>
							<td class="text-sm">{{ (event.type == CprEventType.Rhythm || event.type == CprEventType.RuleOut) ? $t(event.text!) : event.text }}</td>
							<td class="text-sm font-mono">{{ dayjs.unix(event.time).format('HH:mm:ss') }}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center justify-center flex-col md:flex-row">
				<button class="button button-full bg-gray-600 hover:bg-gray-800 text-white text-sm" v-on:click="stop(true)">
					<Icon>
						<HeartPulseIcon />
					</Icon>
					{{ $t('stop-without-save') }}
				</button>
			</div>

			<Footer />
		</div>
	</main>
</template>

<style>
.reversible-cause:nth-child(even) {
	@apply bg-gray-100 dark: bg-gray-700;
}

.table {
	@apply border border-light-600 dark: border-gray-700;
}

.table thead {
	@apply bg-gray-800 text-white;
}

.table tr:nth-child(even) {
	@apply bg-gray-100 dark: bg-gray-700;
}

.table td,
.table th {
	@apply p-2 text-sm text-center;
}
</style>
