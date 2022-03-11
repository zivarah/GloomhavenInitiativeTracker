import { ITrackableClass } from "./TrackableClass";

export interface ISummon extends ITrackableClass<"summon"> {
	characterId: number;
}

export function isSummon(trackableClass: ITrackableClass): trackableClass is ISummon {
	return trackableClass.type === "summon";
}

export const ItemSummonables = ["Steel Construct", "Skeleton", "Spirit Warrior", "Jade Falcon"];
