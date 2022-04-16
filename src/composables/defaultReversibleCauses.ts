import type { CprReversibleCause } from '@/types';

export function useDefaultReversibleCauses() {
	const hts = ['Hypovolemia', 'Hypoxia', 'Hydrogen ion excess (acidosis)',
		'Hypoglycemia', 'Hypo-/Hyperkalemia', 'Hypothermia',
		'Tension pneumothorax', 'Tamponade (cardiac)', 'Toxins',
		'Thrombosis (pulmonary embolus)', 'Thrombosis (myocardial infarction'];

	const defaultHTs : CprReversibleCause[] = [];

	for(const ht of hts) {
		defaultHTs.push({
			name: ht,
			predefined: true,
			ruleIn: false,
			ruleOut: false
		});
	}

	return defaultHTs;
};