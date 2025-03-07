import React, { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { isAlly } from "../model/Ally";
import { isCharacter } from "../model/Character";
import { isMonster } from "../model/Monster";
import {
	createCookieFromState,
	createStateFromCookie,
	ICookie,
	ITrackerState,
	TrackerAction,
	updateTrackerState,
} from "../model/TrackerState";
import "../styles/Tracker.css";
import { Button, IconButton } from "./Buttons";
import { FigureAdder, IExistingClasses } from "./FigureAdder";
import { IHeaderIconProps, Section } from "./Section";
import { TrackedClassRow } from "./TrackedClassRow";

export const Tracker: FC = () => {
	const [cookie, setCookie, removeCookie] = useCookies<keyof ICookie, ICookie>([]);
	const [state, dispatch] = useReducer<React.Reducer<ITrackerState, TrackerAction>, ICookie>(
		updateTrackerState,
		cookie,
		createStateFromCookie
	);

	const [showOptions, setShowOptions] = useState(false);
	const prevRoundStates = useRef<ITrackerState[]>([]);

	const onMenuClick = useCallback(() => setShowOptions(!showOptions), [showOptions]);

	useEffect(() => {
		const expireDate = new Date();
		expireDate.setFullYear(expireDate.getFullYear() + 1);
		const newCookie: ICookie = createCookieFromState(state);

		// Simple and fairly effective deep object comparison, but not perfect.
		if (JSON.stringify(newCookie.classes) !== JSON.stringify(cookie.classes)) {
			removeCookie("state");
			setCookie("classes", newCookie.classes, { expires: expireDate });
		}
	}, [setCookie, removeCookie, state, cookie.classes]);

	const existingFigures = useMemo((): IExistingClasses => {
		const allClasses = Array.from(state.trackedClassesById.values());
		return {
			characters: new Set(allClasses.filter(isCharacter).map(c => c.characterClass)),
			summons: new Map(
				allClasses.filter(isCharacter).map(c => [c.characterClass, new Set(c.activeSummons?.map(s => s.summonClass))])
			),
			monsters: new Set(allClasses.filter(isMonster).map(c => c.monsterClass)),
			allies: new Set(allClasses.filter(isAlly).map(a => a.name)),
		};
	}, [state.trackedClassesById]);

	const undoNewRound = useCallback(() => {
		const prevRoundState = prevRoundStates.current.pop();
		if (prevRoundState) {
			dispatch({ action: "setState", state: prevRoundState });
		}
	}, [dispatch, prevRoundStates]);
	const resetForNewRound = useCallback(() => {
		prevRoundStates.current.push(state);
		while (prevRoundStates.current.length > 10) {
			prevRoundStates.current.shift();
		}
		dispatch({ action: "resetForNewRound" });
	}, [dispatch, state]);
	const beginRound = useCallback(() => {
		dispatch({ action: "beginRound" });
	}, [dispatch]);

	const noFigures = state.orderedIds.length === 0;
	const noCharacters = !Array.from(state.trackedClassesById.values()).some(isCharacter);
	if (noFigures && showOptions) {
		setShowOptions(false);
	}

	const headerIcons = useMemo<IHeaderIconProps[]>(
		() => [{ iconKey: "bars", disabled: noFigures, onClick: onMenuClick }],
		[noFigures, onMenuClick]
	);

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
					<IconButton iconKey="undo" onClick={undoNewRound} disabled={!prevRoundStates.current.length} />
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
