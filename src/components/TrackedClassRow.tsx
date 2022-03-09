import React, { ChangeEvent, FC, KeyboardEventHandler, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { isCharacter } from "../model/Character";
import { isSummon } from "../model/Summon";
import { ITrackableClass } from "../model/TrackableClass";
import { TrackerDispatch } from "../model/TrackerState";

interface ITrackedClassRowProps {
	trackedClass: ITrackableClass;
	dispatch: TrackerDispatch;
	showOptions: boolean;
	tieExistsBetweenAny: boolean;
}

export const TrackedClassRow: FC<ITrackedClassRowProps> = props => {
	const { trackedClass, showOptions, dispatch, tieExistsBetweenAny } = props;

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

	const onDeleteWrapper = useCallback(() => {
		if (isSummon(trackedClass)) {
			dispatch({ action: "deleteSummon", characterId: trackedClass.characterId, summonId: trackedClass.id });
		} else {
			dispatch({ action: "deleteTrackedClass", id: trackedClass.id });
		}
	}, [trackedClass, dispatch]);

	const onMoveDown = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "down" }), [trackedClass, dispatch]);
	const onMoveUp = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "up" }), [trackedClass, dispatch]);

	let initiativeContent: number | ReactElement | undefined;

	const containerClassNames = ["charOuter"];
	if (isSummon(trackedClass)) {
		containerClassNames.push("summonOuter");
		initiativeContent = <div className="initiative" />;
	} else if (!trackedClass.initiative || editingInitiative) {
		initiativeContent = (
			<InitiativeEditor initiative={trackedClass.initiative} setInitiative={setInitiativeWrapper} focus={editingInitiative} />
		);
	} else {
		initiativeContent = (
			<div className="initiative" onClick={onInitiativeClick}>
				{trackedClass.initiative}
			</div>
		);
	}

	const activeSummons = isCharacter(trackedClass) ? trackedClass.activeSummons : undefined;

	return (
		<>
			{activeSummons?.map(summon => (
				<TrackedClassRow
					key={summon.id}
					dispatch={dispatch}
					trackedClass={summon}
					showOptions={showOptions}
					tieExistsBetweenAny={tieExistsBetweenAny}
				/>
			))}
			<div className={containerClassNames.join(" ")}>
				<input type="checkbox" checked={!!trackedClass.turnComplete} onChange={onTurnCompleteChange} />
				<div className={"charName"}>
					{trackedClass.iconKey && <img className="charIcon" src={trackedClass.iconKey} alt="" />}
					{trackedClass.name}
				</div>
				<div className="charInit">{initiativeContent}</div>
				{tieExistsBetweenAny && (
					<>
						<OptionIcon iconKey="arrow-down" visible={!!trackedClass.tiedWithNext} onClick={onMoveDown} />
						<OptionIcon iconKey="arrow-up" visible={!!trackedClass.tiedWithPrevious} onClick={onMoveUp} />
					</>
				)}
				<OptionIcon iconKey="times" visible={showOptions} className="delete" onClick={onDeleteWrapper} />
			</div>
		</>
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

interface IOptionIconProps {
	visible: boolean;
	iconKey: string;
	onClick: () => void;
	className?: string;
}
const OptionIcon: FC<IOptionIconProps> = props => {
	const { visible, iconKey, onClick, className } = props;
	const classNames = ["optionIcon"];
	if (className) {
		classNames.push(className);
	}
	return <div className={classNames.join(" ")}>{visible && <span className={"fa fa-" + iconKey} onClick={onClick} />}</div>;
};
