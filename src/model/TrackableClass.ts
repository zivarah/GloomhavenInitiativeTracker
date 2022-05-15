export interface ITrackableClass<TType extends TrackableClassType = TrackableClassType> {
	readonly type: TType;
	readonly id: number;
	readonly name: string;
	readonly iconKey?: string;
	readonly initiative?: number;
	readonly turnComplete?: boolean;
	readonly tiedWithPrevious?: boolean;
	readonly tiedWithNext?: boolean;
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
