<script lang="ts" setup>
import type { CprReversibleCause } from '@/types';

const props = defineProps<{ reversibleCause: CprReversibleCause }>();

</script>

<template>
	<div>
		{{ props.reversibleCause.name }}
	</div>
</template>