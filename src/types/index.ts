export type CrpState = {
	timers: Record<string, number>, // cycle, epinephrine, start
	reversibleCauses: CprReversibleCause[],
	cycleLength: number,
	cycleCount: number
};

export type CprReversibleCause = {
	name: string;
	predefined: boolean;
	ruleIn: boolean;
	ruleOut: boolean;
};

export type CprEvent = {
	type: string;
	text?: string;
	time: number;
};

export enum CprEventType {
	Start = 'start',
	SetStart = 'set-start',
	End = 'end',
	Cycle = 'cycle',
	Medication = 'medication',
	Rhythm = 'rhythm',
	RuleIn = 'rule-in',
	RuleOut = 'rule-out' 
}