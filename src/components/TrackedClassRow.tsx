import React, { ChangeEvent, FC, useCallback } from "react";
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
	const isCharSummon = isSummon(trackedClass);

	const onTurnCompleteChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			dispatch({ action: "setTurnComplete", id: trackedClass.id, value: event.target.checked });
		},
		[trackedClass, dispatch]
	);

	const onDelete = useCallback(() => {
		if (isCharSummon) {
			dispatch({ action: "deleteSummon", characterId: trackedClass.characterId, summonId: trackedClass.id });
		} else {
			dispatch({ action: "deleteTrackedClass", id: trackedClass.id });
		}
	}, [trackedClass, dispatch, isCharSummon]);

	const onMoveDown = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "down" }), [trackedClass, dispatch]);
	const onMoveUp = useCallback(() => dispatch({ action: "shift", id: trackedClass.id, direction: "up" }), [trackedClass, dispatch]);

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
			<input className="charTurnComplete" type="checkbox" checked={!!trackedClass.turnComplete} onChange={onTurnCompleteChange} />
			<div className="charInfo">
				<div className={"charInfoContainer" + (isCharSummon ? " summonInfoContainer" : "")}>
					<div className="charIcon">{trackedClass.iconKey && <img src={trackedClass.iconKey} alt="" />}</div>
					<div className="charName">{trackedClass.name}</div>
				</div>
			</div>
			<div className="charInit">{!isCharSummon && <InitiativeEditor trackedClass={trackedClass} dispatch={dispatch} />}</div>

			<div className="charMoveButtons">
				{tieExistsBetweenAny && (
					<div className="charMoveButtonContainer">
						{trackedClass.tiedWithPrevious && <div className={"moveUp"} onClick={onMoveUp} />}
						{trackedClass.tiedWithNext && <div className={"moveDown"} onClick={onMoveDown} />}
					</div>
				)}
			</div>

			<div className="charDelete">{showOptions && <span className="fa fa-remove fa-sm" onClick={onDelete} />}</div>

			{!isCharSummon && <div className="charSeparator" />}
		</>
	);
};
