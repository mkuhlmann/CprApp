<script setup lang="ts">
import { ref, watch } from 'vue';
import { Howl } from 'howler';
import dayjs from 'dayjs';

import SyringeIcon from '@vicons/fluent/Syringe24Regular';
import CycleIcon from '@vicons/fluent/ArrowRepeatAll24Filled';
import HeartPulseIcon from '@vicons/fluent/HeartPulse24Regular';
import { Icon } from '@vicons/utils';


import { CprEventType } from '@/types';
import { useStopwatch } from '@/composables/stopwatch';
import { useCprStore } from '@/stores/cpr';
import BeepMp3 from '@/assets/beep.mp3';

const beepSound = new Howl({
	src: [BeepMp3],
	loop: false
});


const cprStore = useCprStore();
const cycleDue = ref(false);
const totalStopwatch = useStopwatch(1000, true);
const cycleStopwatch = useStopwatch();
const epinephrineStopwatch = useStopwatch();

const start = () => {
	cprStore.start();
	cprStore.addNewEvent(CprEventType.Start);
	totalStopwatch.start();
	cycleStopwatch.start();
};

const cycle = () => {
	cycleDue.value = false;
	cprStore.cycle();
	cycleStopwatch.reset();
};

const epinephrine = () => {
	if (epinephrineStopwatch.running.value) {
		epinephrineStopwatch.reset();
	} else {
		epinephrineStopwatch.start();
	}
	cprStore.addNewEvent(CprEventType.Medication, 'Epinephrine 1 mg');
};

const rhythm = (rhythm: string) => {
	cprStore.addNewEvent(CprEventType.Rhythm, rhythm);
};

watch(cycleStopwatch.elapsed, (newVal) => {
	if (!cycleDue.value && cycleStopwatch.elapsed.value > cprStore.cycleLength) {
		cycleDue.value = true;
		beepSound.play();
	}
});

</script>

<template>
	<main>
		<div class="md:w-1/4 mx-auto flex flex-col items-center py-10 gap-5">
			<div class="border border-light-600 dark:border-gray-700 text-sm text-center">
				<div class="border-b border-light-600 dark:border-gray-700 p-1">Epinephrine</div>
				<div v-if="!epinephrineStopwatch.running.value">--:--</div>
				<div v-else>{{ epinephrineStopwatch.formatted.value }}</div>
			</div>
			<div
				class="text-5xl font-bold"
				v-bind:class="{ 'text-red-500': cycleStopwatch.elapsed.value > cprStore.cycleLength }"
			>{{ cycleStopwatch.formatted.value }}</div>
			<div class>{{ $t('cycle') }}: {{ cprStore.cycleCount }}, {{ totalStopwatch.formatted.value }}</div>

			<div class="w-full" v-if="!cprStore.running">
				<button
					
					v-on:click="start"
					class="button w-full py-4 bg-green-600 hover:bg-green-500 text-white"
				>Start</button>

				<img class="w-1/2 mx-auto" src="/logo.svg">
			</div>

			<div class="w-full" v-if="cprStore.running">
				<div class="flex gap-3 items-center justify-center flex-col md:flex-row">
					<button
						class="button button-full bg-blue-600 hover:bg-blue:400 disabled:bg-blue-gray-500 px-4 py-4 text-white"
						v-bind:disabled="cycleStopwatch.elapsed.value < cprStore.cycleLength"
						v-on:click="cycle()"
					>
						<Icon>
							<CycleIcon />
						</Icon>
						{{ $t('cycle') }}
					</button>
					<button
						class="button button-full bg-red-600 hover:bg-red-400 py-4 text-white "
						v-on:click="epinephrine()"
					>
						<Icon>
							<SyringeIcon />
						</Icon>
						{{ $t('epinephrine') }}
					</button>
					
				</div>
				<div class="flex justify-center mt-3 mb-1 uppercase font-semibold">{{ $t('rhythm') }}</div>
				<div class="flex gap-3 items-center justify-center flex-col md:flex-row">
					<button
						class="button button-full bg-green-600 hover:bg-green-400 text-white"
						v-on:click="rhythm('pea')"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('pea') }}
					</button>
					<button
						class="button button-full bg-green-600 hover:bg-green-400 text-white"
						v-on:click="rhythm('asystole')"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('asystole') }}
					</button>
					<button
						class="button button-full bg-amber-600 hover:bg-amber-400 text-white"
						v-on:click="rhythm('vt')"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vt') }}
					</button>
					<button
						class="button button-full bg-amber-600 hover:bg-amber-400 text-white"
						v-on:click="rhythm('vf')"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vf') }}
					</button>
				</div>
			</div>

			<div class="w-full md:w-auto" v-if="cprStore.running">
				<table class="table w-full">
					<thead>
						<tr>
							<th>Type</th>
							<th></th>
							<th>Time</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="event in cprStore.events">
							<td class="text-sm">{{ $t(event.type) }}</td>
							<td class="text-sm">{{ event.type == CprEventType.Rhythm ? $t(event.text!) : event.text }}</td>
							<td class="text-sm">{{ dayjs.unix(event.time).format('HH:mm:ss') }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</template>

<style>
.button {
	@apply disabled:cursor-not-allowed px-4 py-2  transition-colors;
}

.button-full {
	@apply w-full md:w-auto ;
}


.table {
	@apply border border-light-600 dark:border-gray-700;
}

.table thead {
	@apply bg-gray-800 text-white;
}

.table tr:nth-child(even) {
	@apply bg-gray-100 dark:bg-gray-700;
}

.table td,
.table th {
	@apply p-2 text-sm;
}
</style>
