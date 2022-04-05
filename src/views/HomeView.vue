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

watch(cycleStopwatch.elapsed, (newVal) => {
	if (!cycleDue.value && cycleStopwatch.elapsed.value > cprStore.cycleLength) {
		cycleDue.value = true;
		beepSound.play();
	}
});

</script>

<template>
	<main>
		<div class="container mx-auto flex flex-col items-center py-10 gap-5">
			<div class="border border-light-600 text-sm text-center">
				<div class="border-b border-light-600 p-1">Epinephrine</div>
				<div v-if="!epinephrineStopwatch.running.value">--:--</div>
				<div v-else>{{ epinephrineStopwatch.formatted.value }}</div>
			</div>
			<div
				class="text-5xl font-bold"
				v-bind:class="{ 'text-red-500': cycleStopwatch.elapsed.value > cprStore.cycleLength }"
			>{{ cycleStopwatch.formatted.value }}</div>
			<div class>{{ $t('cycle') }}: {{ cprStore.cycleCount }}, {{ totalStopwatch.formatted.value }}</div>

			<div>
				<button
					v-if="!cprStore.running"
					v-on:click="start"
					class="rounded bg-green-600 hover:bg-green-500 px-4 py-2 text-white transition-colors"
				>Start</button>
			</div>

			<div v-if="cprStore.running">
				<div class="flex gap-3 items-center justify-center">
					<button
						class="rounded bg-blue-600 hover:bg-blue:400 disabled:bg-blue-gray-500 disabled:cursor-not-allowed px-4 py-2 text-white"
						v-bind:disabled="cycleStopwatch.elapsed.value < cprStore.cycleLength"
						v-on:click="cycle()"
					>
						<Icon>
							<CycleIcon />
						</Icon>
						{{ $t('cycle') }}
					</button>
					<button
						class="rounded bg-red-600 hover:bg-red:400 px-4 py-2 text-white"
						v-on:click="epinephrine()"
					>
						<Icon>
							<SyringeIcon />
						</Icon>
						{{ $t('epinephrine') }}
					</button>
				</div>
				<div class="flex justify-center mt-3 mb-1">{{ $t('rhythm') }}:</div>
				<div class="flex gap-3 items-center justify-center">
					<button
						class="rounded bg-green-600 hover:bg-green:400 px-4 py-2 text-white"
						v-on:click="epinephrine()"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('pea') }}
					</button>
					<button
						class="rounded bg-green-600 hover:bg-green:400 px-4 py-2 text-white"
						v-on:click="epinephrine()"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('asystolic') }}
					</button>
					<button
						class="rounded bg-amber-600 hover:bg-amber:400 px-4 py-2 text-white"
						v-on:click="epinephrine()"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vt') }}
					</button>
					<button
						class="rounded bg-amber-600 hover:bg-amber:400 px-4 py-2 text-white"
						v-on:click="epinephrine()"
					>
						<Icon>
							<HeartPulseIcon />
						</Icon>
						{{ $t('vf') }}
					</button>
				</div>
			</div>

			<div v-if="cprStore.running">
				<table class="table">
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
							<td class="text-sm">{{ event.text }}</td>
							<td class="text-sm">{{ dayjs.unix(event.time).format('HH:mm:ss') }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</main>
</template>

<style>
.table {
	@apply border border-light-600;
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
