import { ITrackableClass } from "./TrackableClass";

export interface IAlly extends ITrackableClass<"ally"> {}

export function isAlly(trackableClass: ITrackableClass): trackableClass is IAlly {
	return trackableClass.type === "ally";
}
