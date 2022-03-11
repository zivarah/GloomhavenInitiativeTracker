import React, { ChangeEvent, FC, ReactElement, useCallback, useState } from "react";
import { isCharacter } from "../model/Character";
import { isSummon } from "../model/Summon";
import { ITrackableClass } from "../model/TrackableClass";
import { TrackerDispatch } from "../model/TrackerState";
import "../styles/TrackedClassRow.css";
import { InitiativeEditor } from "./InitiativeEditor";

interface ITrackedClassRowProps {
	trackedClass: ITrackableClass;
	dispatch: TrackerDispatch;
	showOptions: boolean;
	tieExistsBetweenAny: boolean;
}

export const TrackedClassRow: FC<ITrackedClassRowProps> = props => {
	const { trackedClass, showOptions, dispatch, tieExistsBetweenAny } = props;
	const [editingInitiative, setEditingInitiative] = useState(false);
	const isCharSummon = isSummon(trackedClass);

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
		if (isCharSummon) {
			dispatch({ action: "deleteSummon", characterId: trackedClass.characterId, summonId: trackedClass.id });
		} else {
			dispatch({ action: "deleteTrackedClass", id: trackedClass.id });
		}
	}, [trackedClass, dispatch]);

	const onMoveDown = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "down" }), [trackedClass, dispatch]);
	const onMoveUp = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "up" }), [trackedClass, dispatch]);

	let initiativeContent: number | ReactElement | undefined;

	if (isCharSummon) {
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
			<input
				className={["charTurnComplete"].join(" ")}
				type="checkbox"
				checked={!!trackedClass.turnComplete}
				onChange={onTurnCompleteChange}
			/>
			<div className={["charInfo", isCharSummon ? "summonInfo" : undefined].join(" ")}>
				<div className="charInfoContainer">
					{trackedClass.iconKey && (
						<div className="charIcon">
							<img src={trackedClass.iconKey} alt="" />
						</div>
					)}
					<div className={["charName"].join(" ")}>{trackedClass.name}</div>
				</div>
			</div>
			<div className={["charInit"].join(" ")}>{initiativeContent}</div>

			<div className={["charMoveButtons"].join(" ")}>
				{tieExistsBetweenAny && (
					<div className="charMoveButtonContainer">
						{trackedClass.tiedWithPrevious && <div className={"moveUp"} onClick={onMoveUp} />}
						{trackedClass.tiedWithNext && <div className={"moveDown"} onClick={onMoveDown} />}
					</div>
				)}
			</div>

			<div className={["charDelete"].join(" ")}>
				{showOptions && <span className="fa fa-remove fa-sm" onClick={onDeleteWrapper} />}
			</div>

			{!isCharSummon && <div className="charSeparator" />}
		</>
	);
};
