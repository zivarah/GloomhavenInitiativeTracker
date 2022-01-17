import React, { ChangeEvent, FC, KeyboardEventHandler, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { ITrackableClassInfo } from "../model/TrackableClass";

interface ITrackedClassRowProps {
	id: number;
	name: string;
	initiative: number | undefined;
	setInitiative(id: number, value: number | undefined): void;
	turnComplete: boolean;
	setTurnComplete(id: number, value: boolean): void;
	classInfo: ITrackableClassInfo;
	deleteTrackedClass(id: number): void;
	showOptions: boolean;
	moveDown?(id: number): void;
	moveUp?(id: number): void;
}

export const TrackedClassRow: FC<ITrackedClassRowProps> = props => {
	const {
		id,
		name,
		initiative,
		setInitiative,
		turnComplete,
		setTurnComplete,
		classInfo,
		deleteTrackedClass,
		showOptions,
		moveDown,
		moveUp,
	} = props;

	const [editingInitiative, setEditingInitiative] = useState(false);

	const setInitiativeWrapper = useCallback(
		(newInitiative: number | undefined) => {
			setInitiative(id, newInitiative);
			setEditingInitiative(false);
		},
		[id, setInitiative, setEditingInitiative]
	);
	const setTurnCompleteWrapper = useCallback(
		(value: boolean) => {
			setTurnComplete(id, value);
			setEditingInitiative(false);
		},
		[id, setTurnComplete, setEditingInitiative]
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

	const onDelete = useCallback(() => deleteTrackedClass(id), [id, deleteTrackedClass]);
	const onMoveUpWrapper = useCallback(() => moveUp && moveUp(id), [id, moveUp]);
	const onMoveDownWrapper = useCallback(() => moveDown && moveDown(id), [id, moveDown]);

	let initiativeContent: number | ReactElement | undefined;
	if (!initiative || editingInitiative) {
		initiativeContent = <InitiativeEditor initiative={initiative} setInitiative={setInitiativeWrapper} focus={editingInitiative} />;
	} else {
		initiativeContent = (
			<>
				<div className="initiative" onClick={onInitiativeClick}>
					{initiative}
				</div>
				{moveUp && <span className="fa fa-arrow-up" onClick={onMoveUpWrapper} />}
				{moveDown && <span className="fa fa-arrow-down" onClick={onMoveDownWrapper} />}
				{showOptions && <span className="initEdit fa fa-pencil" onClick={onInitiativeClick} />}
			</>
		);
	}

	return (
		<div className="charOuter">
			<input type="checkbox" checked={!!turnComplete} onChange={onTurnCompleteChange} />
			<div className="charName">
				{classInfo.iconKey && <img className="charIcon" src={classInfo.iconKey} alt="" />}
				{name}
			</div>
			<div className="charInit">{initiativeContent}</div>
			{showOptions && <span className="fa fa-times" onClick={onDelete} />}
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
				min={1}
				max={99}
				value={pendingInitiative}
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
