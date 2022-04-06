import React, { FC, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useCookies } from "react-cookie";
import { isAlly } from "../model/Ally";
import { isCharacter } from "../model/Character";
import { isMonster } from "../model/Monster";
import { createInitialState, ICookie, ITrackerState, TrackerAction, updateTrackerState } from "../model/TrackerState";
import "../styles/Tracker.css";
import { Button } from "./Buttons";
import { FigureAdder, IExistingClasses } from "./FigureAdder";
import { Section } from "./Section";
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

	const onMenuClick = useCallback(() => setshowOptions(!showOptions), [showOptions]);

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

	const noFigures = state.orderedIds.length === 0;
	const noCharacters = !Array.from(state.trackedClassesById.values()).some(isCharacter);

	const headerIcons = useMemo(() => [{ iconKey: "bars", disabled: noFigures, onClick: onMenuClick }], [noFigures, onMenuClick]);

	return (
		<div className="trackerContainer">
			<Section title="Active Figures" headerIcons={headerIcons}>
				{noCharacters && <NoCharacterWarning />}
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
				<div className="roundActionsOuter">
					<Button caption="New Round" iconKey="rotate" onClick={resetForNewRound} disabled={noCharacters} />
					<Button caption="Begin Round" iconKey="play" onClick={beginRound} disabled={noCharacters} />
				</div>
			</Section>

			<Section title="Add Figures" collapsible>
				<FigureAdder existingFigures={existingFigures} dispatch={dispatch} />
			</Section>
		</div>
	);
};

const NoCharacterWarning: FC = () => {
	return (
		<>
			<div className="noFiguresPlaceholder">
				<span className="fa-solid fa-triangle-exclamation" />
				<span>No characters added</span>
			</div>
			<div className="separator" />
		</>
	);
};
