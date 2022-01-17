export interface ITrackableClass {
	id: number;
	name: string;
	initiative?: number;
	turnComplete?: boolean;
}

export interface ITrackableClassInfo {
	name: string;
	iconKey?: string;
}
