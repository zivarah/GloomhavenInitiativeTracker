import React, { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { isCharacter } from "../model/Character";
import { isMonster } from "../model/Monster";
import { createInitialState, ICookie, ITrackerState, TrackerAction, updateTrackerState } from "../model/TrackerState";
import "../styles/Tracker.css";
import { ClassAdder, IExistingClasses } from "./ClassAdder";
import { RoundActions } from "./RoundActions";
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
	const onMenuClick = useCallback(() => setshowOptions(!showOptions), [showOptions, setshowOptions]);

	useEffect(() => {
		const expireDate = new Date();
		expireDate.setFullYear(expireDate.getFullYear() + 1);
		const stateCookie: ICookie["state"] = { ...state, trackedClassesById: Array.from(state.trackedClassesById.entries()) };

		// Simple and fairly effective deep object comparison, but not perfect.
		if (JSON.stringify(stateCookie) !== JSON.stringify(cookie.state)) {
			setCookie("state", stateCookie, { expires: expireDate });
		}
	}, [setCookie, state]);

	const existingClasses = useMemo((): IExistingClasses => {
		const allClasses = Array.from(state.trackedClassesById.values());
		return {
			characters: new Set(allClasses.filter(isCharacter).map(c => c.characterClass)),
			monsters: new Set(allClasses.filter(isMonster).map(c => c.monsterClass)),
		};
	}, [state.trackedClassesById]);

	return (
		<div className="trackerOuter">
			<div className="menu" onClick={onMenuClick}>
				<span className="fa fa-ellipsis-v" />
			</div>
			{state.orderedIds.length === 0 ? (
				"No characters added"
			) : (
				<div className="trackerClasses">
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
			<RoundActions dispatch={dispatch} />
			<ClassAdder existingClasses={existingClasses} dispatch={dispatch} />
		</div>
	);
};
