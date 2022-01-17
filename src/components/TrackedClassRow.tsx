import React, { ChangeEvent, FC, KeyboardEventHandler, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { characterClassInfos, isCharacter } from "../model/Character";
import { isMonster, monsterClassInfos } from "../model/Monster";
import { ITrackableClass } from "../model/TrackableClass";
import { TrackerAction } from "../model/TrackerState";

interface ITrackedClassRowProps {
	trackedClass: ITrackableClass;
	dispatch: React.Dispatch<TrackerAction>;
	showOptions: boolean;
}

export const TrackedClassRow: FC<ITrackedClassRowProps> = props => {
	const { trackedClass, showOptions, dispatch } = props;

	const [editingInitiative, setEditingInitiative] = useState(false);

	const setInitiativeWrapper = useCallback(
		(value: number | undefined) => {
			dispatch({ action: "setInitiative", id: trackedClass.id, value });
			setEditingInitiative(false);
		},
		[trackedClass.id, setEditingInitiative, dispatch]
	);
	const setTurnCompleteWrapper = useCallback(
		(value: boolean) => {
			dispatch({ action: "setTurnComplete", id: trackedClass.id, value });
			setEditingInitiative(false);
		},
		[trackedClass.id, setEditingInitiative, dispatch]
	);

	const onInitiativeClick = useCallback(() => {
		setEditingInitiative(true);
	}, [setEditingInitiative]);

	const onTurnCompleteChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setTurnCompleteWrapper(event.target.checked);
		},
		[setTurnCompleteWrapper]
	);

	const classInfo = isCharacter(trackedClass)
		? characterClassInfos[trackedClass.characterClass]
		: isMonster(trackedClass)
		? monsterClassInfos[trackedClass.monsterClass]
		: undefined;

	const onDeleteWrapper = useCallback(() => dispatch({ action: "deleteTrackedClass", id: trackedClass.id }), [trackedClass.id, dispatch]);

	const onMoveDown = useCallback(
		() => dispatch({ action: "shift", id: trackedClass.id, direction: "down" }),
		[trackedClass.id, dispatch]
	);
	const onMoveUp = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "up" }), [trackedClass.id, dispatch]);

	let initiativeContent: number | ReactElement | undefined;
	if (!trackedClass.initiative || editingInitiative) {
		initiativeContent = (
			<InitiativeEditor initiative={trackedClass.initiative} setInitiative={setInitiativeWrapper} focus={editingInitiative} />
		);
	} else {
		initiativeContent = (
			<>
				<div className="initiative" onClick={onInitiativeClick}>
					{trackedClass.initiative}
				</div>
				{trackedClass.tiedWithNext && <span className="fa fa-arrow-down" onClick={onMoveDown} />}
				{trackedClass.tiedWithPrevious && <span className="fa fa-arrow-up" onClick={onMoveUp} />}
				{showOptions && <span className="initEdit fa fa-pencil" onClick={onInitiativeClick} />}
			</>
		);
	}

	return (
		<div className="charOuter">
			<input type="checkbox" checked={!!trackedClass.turnComplete} onChange={onTurnCompleteChange} />
			<div className="charName">
				{classInfo?.iconKey && <img className="charIcon" src={classInfo.iconKey} alt="" />}
				{trackedClass.name}
			</div>
			<div className="charInit">{initiativeContent}</div>
			{showOptions && <span className="fa fa-times" onClick={onDeleteWrapper} />}
		</div>
	);
};

interface IInitiativeEditorProps {
	initiative: number | undefined;
	setInitiative(newInitiative: number): void;
	focus: boolean;
}

const InitiativeEditor: FC<IInitiativeEditorProps> = props => {
	const { initiative, setInitiative, focus } = props;
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [pendingInitiative, setPendingInitiative] = useState<number | undefined>(initiative);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPendingInitiative(validateInitiative(event.target.value));
		},
		[setPendingInitiative]
	);

	const onAccept = useCallback(() => {
		if (pendingInitiative) {
			setInitiative(pendingInitiative);
		}
	}, [pendingInitiative, setInitiative]);

	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
		event => {
			switch (event.key) {
				case "Enter":
					onAccept();
					break;
			}
		},
		[onAccept]
	);

	const onBlur = useCallback(() => {
		onAccept();
	}, [onAccept]);

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [focus]);

	return (
		<div>
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
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
		</div>
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
