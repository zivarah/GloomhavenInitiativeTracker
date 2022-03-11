import React, { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { isAlly } from "../model/Ally";
import { isCharacter } from "../model/Character";
import { isMonster } from "../model/Monster";
import { createInitialState, ICookie, ITrackerState, TrackerAction, updateTrackerState } from "../model/TrackerState";
import "../styles/Tracker.css";
import { FigureAdder, IExistingClasses } from "./FigureAdder";
import { TrackedClassRow } from "./TrackedClassRow";

interface ITrackerProps {}
export const Tracker: FC<ITrackerProps> = props => {
	const [cookie, setCookie] = useCookies<"state", ICookie>([]);
	const [state, dispatch] = useReducer<React.Reducer<ITrackerState, TrackerAction>, ICookie>(
		updateTrackerState,
		cookie,
		createInitialState
	);

	const [showOptions, setshowOptions] = useState(false);
	const [figureAdderExpanded, classAddedExpanded] = useState(true);

	const onMenuClick = useCallback(() => setshowOptions(!showOptions), [showOptions, setshowOptions]);

	useEffect(() => {
		const expireDate = new Date();
		expireDate.setFullYear(expireDate.getFullYear() + 1);
		const stateCookie: ICookie["state"] = { ...state, trackedClassesById: Array.from(state.trackedClassesById.entries()) };

		// Simple and fairly effective deep object comparison, but not perfect.
		if (JSON.stringify(stateCookie) !== JSON.stringify(cookie.state)) {
			setCookie("state", stateCookie, { expires: expireDate });
		}
	}, [setCookie, state, cookie.state]);

	const existingFigures = useMemo((): IExistingClasses => {
		const allClasses = Array.from(state.trackedClassesById.values());
		return {
			characters: new Set(allClasses.filter(isCharacter).map(c => c.characterClass)),
			monsters: new Set(allClasses.filter(isMonster).map(c => c.monsterClass)),
			allies: new Set(allClasses.filter(isAlly).map(a => a.name)),
		};
	}, [state.trackedClassesById]);

	const resetForNewRound = useCallback(() => {
		dispatch({ action: "resetForNewRound" });
	}, [dispatch]);
	const beginRound = useCallback(() => {
		dispatch({ action: "beginRound" });
	}, [dispatch]);

	const onToggleExpand = useCallback(() => classAddedExpanded(!figureAdderExpanded), [figureAdderExpanded, classAddedExpanded]);

	return (
		<div className="trackerContainer">
			<div className="activeFiguresContainer trackerComponentContainer">
				<div className="menu" onClick={onMenuClick}>
					<span className="fa fa-bars" />
				</div>
				<div className="title">Active Figures</div>
				<hr />
				{state.orderedIds.length === 0 ? (
					"No characters added"
				) : (
					<div className="trackedClassContainer">
						{state.orderedIds.map(id => {
							const trackedClass = state.trackedClassesById.get(id);
							if (!trackedClass) {
								throw new Error("Invalid character/monster state encountered");
							}

							return (
								<TrackedClassRow
									key={trackedClass.id}
									trackedClass={trackedClass}
									showOptions={showOptions}
									dispatch={dispatch}
									tieExistsBetweenAny={state.tieExistsBetweenAny}
								/>
							);
						})}
					</div>
				)}
				<div className="roundActionsOuter">
					<button className="roundActionsButton" onClick={resetForNewRound}>
						<i className="fa fa-rotate" />
						&nbsp;New Round
					</button>
					<button className="roundActionsButton" onClick={beginRound}>
						<i className="fa fa-play" />
						&nbsp;Begin Round
					</button>
				</div>
			</div>

			<div className="figureAdderContainer trackerComponentContainer">
				<div onClick={onToggleExpand}>
					<div className="title">Add Figures</div>
					<div className={"collapseExpand fa " + (figureAdderExpanded ? "fa-angles-up" : "fa-angles-down")} />
				</div>
				{figureAdderExpanded && (
					<>
						<hr />
						<FigureAdder existingFigures={existingFigures} dispatch={dispatch} />
					</>
				)}
			</div>
		</div>
	);
};
