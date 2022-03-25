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
			<input className="classTurnComplete" type="checkbox" checked={!!trackedClass.turnComplete} onChange={onTurnCompleteChange} />
			<div className="classInfo">
				<div className={"classInfoContainer" + (isCharSummon ? " summonInfoContainer" : "")}>
					<div className="classIcon">{trackedClass.iconKey && <img src={trackedClass.iconKey} alt="" />}</div>
					<div className="className">{trackedClass.name}</div>
				</div>
			</div>
			<div className="classInit">{!isCharSummon && <InitiativeEditor trackedClass={trackedClass} dispatch={dispatch} />}</div>

			<div className="classMoveButtons">
				{tieExistsBetweenAny && (
					<div className="classMoveButtonContainer">
						{trackedClass.tiedWithPrevious && <div className={"moveUp"} onClick={onMoveUp} />}
						{trackedClass.tiedWithNext && <div className={"moveDown"} onClick={onMoveDown} />}
					</div>
				)}
			</div>

			<div className="classDelete">{showOptions && <span className="fa fa-remove fa-sm" onClick={onDelete} />}</div>

			{!isCharSummon && <div className="classSeparator" />}
		</>
	);
};
