import React, { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from "react";
import { ITrackableClass } from "../model/TrackableClass";
import { TrackerDispatch } from "../model/TrackerState";
import "../styles/InitiativeEditor.css";

interface IInitiativeEditorProps {
	trackedClass: ITrackableClass;
	dispatch: TrackerDispatch;
}

export const InitiativeEditor: FC<IInitiativeEditorProps> = props => {
	const { trackedClass, dispatch } = props;
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [pendingInitiative, setPendingInitiative] = useState<number | undefined>(trackedClass.initiative);

	useEffect(() => {
		setPendingInitiative(trackedClass.initiative);
	}, [trackedClass.initiative]);

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setPendingInitiative(validateInitiative(event.target.value));
	}, []);

	const onAccept = useCallback(() => {
		if (pendingInitiative) {
			dispatch({ action: "setInitiative", id: trackedClass.id, value: pendingInitiative });
		}
	}, [pendingInitiative, dispatch, trackedClass.id]);

	const onFocus = useCallback(() => {
		inputRef.current?.select();
	}, []);

	return (
		<input
			className="initInput"
			ref={inputRef}
			type="text"
			inputMode="numeric"
			pattern="[0-9]*"
			min={1}
			max={99}
			value={pendingInitiative ?? ""}
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onAccept}
		/>
	);
};
function validateInitiative(valueStr: string | undefined): number | undefined {
	if (!valueStr) return undefined;
	const value = parseInt(valueStr);
	if (isNaN(value)) {
		return undefined;
	}
	if (value < 1) {
		return 1;
	}
	if (value > 99) {
		return 99;
	}
	if (!Number.isInteger(value)) {
		return Math.round(value);
	}
	return value;
}
