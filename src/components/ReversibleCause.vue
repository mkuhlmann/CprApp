<script lang="ts" setup>
import { useCprEventStore } from '@/stores/cprEvent';
import { CprEventType, type CprReversibleCause } from '@/types';

const cprEventStore = useCprEventStore();

const props = defineProps<{ reversibleCause: CprReversibleCause }>();

const toggle = function() {
	if(!props.reversibleCause.ruleOut) {
		cprEventStore.addNewEvent(CprEventType.RuleOut, props.reversibleCause.name);
	}
	props.reversibleCause.ruleOut = !props.reversibleCause.ruleOut;
};

</script>

<template>
	<div class="reversible-cause" v-on:click="toggle">
		<input type="checkbox" :checked="props.reversibleCause.ruleOut" />
		<span class="ml-2" v-bind:class="{'line-through': props.reversibleCause.ruleOut}">{{ $t(props.reversibleCause.name) }}</span>
	</div>
</template>

<style>
.reversible-cause {
	@apply p-2 cursor-pointer;
}
.reversible-cause > * {
	@apply cursor-pointer;
}
.reversible-cause:nth-child(even) {
	@apply ybg-gray-100 dark:bg-gray-700;
}
</style>