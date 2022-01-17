export interface ITrackableClass<TType extends string = string> {
	type: TType;
	id: number;
	name: string;
	initiative?: number;
	turnComplete?: boolean;
	tiedWithPrevious?: boolean;
	tiedWithNext?: boolean;
}

export interface ITrackableClassInfo {
	name: string;
	iconKey?: string;
}
