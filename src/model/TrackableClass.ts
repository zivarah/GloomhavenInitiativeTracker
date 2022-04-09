export interface ITrackableClass<TType extends TrackableClassType = TrackableClassType> {
	type: TType;
	id: number;
	name: string;
	iconKey?: string;
	initiative?: number;
	turnComplete?: boolean;
	tiedWithPrevious?: boolean;
	tiedWithNext?: boolean;
}

export interface ITrackableClassInfo {
	name: string;
}

export enum TrackableClassType {
	character = 1,
	monster,
	summon,
	ally,
}
