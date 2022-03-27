export type CprEvent = {
	type: string;
	text?: string;
	time: number;
};

export enum CprEventType {
	Start = 'start',
	End = 'end',
	Cycle = 'cycle',
	Medication = 'medication'
}