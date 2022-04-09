import { ITrackableClass, TrackableClassType } from "./TrackableClass";

export interface IAlly extends ITrackableClass<TrackableClassType.ally> {}

export function isAlly(trackableClass: ITrackableClass): trackableClass is IAlly {
	return trackableClass.type === TrackableClassType.ally;
}
