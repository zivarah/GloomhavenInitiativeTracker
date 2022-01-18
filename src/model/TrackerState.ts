import { CharacterClass, ICharacter, isCharacter } from "./Character";
import { IMonster, isMonster, MonsterClass, monsterClassInfos } from "./Monster";
import { ITrackableClass } from "./TrackableClass";

export interface ICookie {
	characters?: ICharacterForCookie[];
	monsters?: IMonsterForCookie[];
}

interface ICharacterForCookie {
	name: string;
	characterClass: CharacterClass;
}

interface IMonsterForCookie {
	monsterClass: MonsterClass;
}

export enum RoundPhase {
	choosingInitiative,
	initiativesChosen,
}
export function createInitialState(cookie?: ICookie): ITrackerState {
	const initialState = {
		trackedClassesById: new Map<number, ITrackableClass>(),
		orderedIds: [],
		nextId: 0,
		phase: RoundPhase.choosingInitiative,
		cookie,
	};
	if (Array.isArray(cookie?.characters)) {
		cookie?.characters?.forEach(c => addCharacter(initialState, c.name, c.characterClass));
	}
	if (Array.isArray(cookie?.monsters)) {
		cookie?.monsters?.forEach(m => addMonster(initialState, m.monsterClass));
	}
	return initialState;
}

export interface ITrackerState {
	trackedClassesById: ReadonlyMap<number, ITrackableClass>;
	orderedIds: readonly number[];
	nextId: number;
	phase: RoundPhase;
	cookie?: ICookie;
}

export type TrackerAction =
	| { action: "addMonster"; monsterClass: MonsterClass }
	| { action: "addCharacter"; characterClass: CharacterClass; name: string }
	| { action: "deleteTrackedClass"; id: number }
	| { action: "setInitiative"; id: number; value: number | undefined }
	| { action: "setTurnComplete"; id: number; value: boolean }
	| { action: "resetForNewRound" }
	| { action: "beginRound" }
	| { action: "shift"; id: number; direction: "up" | "down" };

export function updateTrackerState(prevState: ITrackerState, action: TrackerAction): ITrackerState {
	const newState = { ...prevState };
	switch (action.action) {
		case "addMonster":
			addMonster(newState, action.monsterClass);
			break;
		case "addCharacter":
			addCharacter(newState, action.name, action.characterClass);
			break;
		case "deleteTrackedClass":
			deleteTrackedClass(newState, action.id);
			break;
		case "setInitiative":
			setInitiative(newState, action.id, action.value);
			break;
		case "setTurnComplete":
			setTurnComplete(newState, action.id, action.value);
			break;
		case "resetForNewRound":
			resetForNewRound(newState);
			break;
		case "beginRound":
			beginRound(newState);
			break;
		case "shift":
			shift(newState, action.id, action.direction);
			break;
	}
	return newState;
}

export function addMonster(state: ITrackerState, monsterClassId: MonsterClass): void {
	const newMonster: IMonster = {
		type: "monster",
		id: state.nextId++,
		name: monsterClassInfos[monsterClassId].name,
		monsterClass: monsterClassId,
	};
	state.trackedClassesById = new Map(state.trackedClassesById).set(newMonster.id, newMonster);
	state.orderedIds = [...state.orderedIds, newMonster.id];
	updateOnTrackedClassesChanged(state);
}

export function addCharacter(state: ITrackerState, name: string, characterClassId: CharacterClass): void {
	const newCharacter: ICharacter = {
		type: "character",
		id: state.nextId++,
		name,
		characterClass: characterClassId,
	};

	state.trackedClassesById = new Map(state.trackedClassesById).set(newCharacter.id, newCharacter);
	state.orderedIds = [...state.orderedIds, newCharacter.id];
	updateOnTrackedClassesChanged(state);
}

function deleteTrackedClass(state: ITrackerState, idToDelete: number): void {
	const newTrackedClassesById = new Map(state.trackedClassesById);
	newTrackedClassesById.delete(idToDelete);
	state.trackedClassesById = newTrackedClassesById;
	state.orderedIds = state.orderedIds.filter(id => id !== idToDelete);
	updateOnTrackedClassesChanged(state);
}

function setInitiative(state: ITrackerState, id: number, value: number | undefined): void {
	const trackedClass = state.trackedClassesById.get(id);
	if (trackedClass) {
		state.trackedClassesById = new Map(state.trackedClassesById).set(id, { ...trackedClass, initiative: value });
	}
	updateTieProps(state);
}

function setTurnComplete(state: ITrackerState, id: number, value: boolean): void {
	const trackedClass = state.trackedClassesById.get(id);
	if (trackedClass) {
		state.trackedClassesById = new Map(state.trackedClassesById).set(id, { ...trackedClass, turnComplete: value });
	}
}

function resetForNewRound(state: ITrackerState): void {
	const newTrackedClassesById = new Map(state.trackedClassesById);
	state.trackedClassesById.forEach((tc, id) => {
		newTrackedClassesById.set(id, { ...tc, initiative: undefined, turnComplete: false });
	});
	state.trackedClassesById = newTrackedClassesById;
	state.phase = RoundPhase.choosingInitiative;
}

function beginRound(state: ITrackerState): void {
	state.orderedIds = [...Array.from(state.trackedClassesById.values())]
		.sort((a, b) => (a.initiative ?? 0) - (b.initiative ?? 0))
		.map(tc => tc.id);
	updateTieProps(state);
	state.phase = RoundPhase.initiativesChosen;
}

function shift(state: ITrackerState, id: number, direction: "up" | "down"): void {
	const index1 = state.orderedIds.indexOf(id);
	const index2 = direction === "up" ? index1 - 1 : index1 + 1;
	const id2 = state.orderedIds[index2];
	const newOrderedIds = [...state.orderedIds];
	newOrderedIds[index1] = id2;
	newOrderedIds[index2] = id;
	state.orderedIds = newOrderedIds;
	updateTieProps(state);
}

function updateTieProps(state: ITrackerState): void {
	for (let i = 0; i < state.orderedIds.length; i++) {
		const tc = state.trackedClassesById.get(state.orderedIds[i]);

		const prev = i > 0 ? state.trackedClassesById.get(state.orderedIds[i - 1]) : undefined;
		const next = i < state.orderedIds.length ? state.trackedClassesById.get(state.orderedIds[i + 1]) : undefined;
		if (!tc) {
			throw new Error("tracker state corruption detected");
		}

		const newTc: ITrackableClass = {
			...tc,
			tiedWithPrevious: prev && !!tc.initiative && tc.initiative === prev.initiative,
			tiedWithNext: next && !!tc.initiative && tc.initiative === next.initiative,
		};

		if (!!newTc.tiedWithPrevious !== !!tc.tiedWithPrevious || !!newTc.tiedWithNext !== !!tc.tiedWithNext) {
			state.trackedClassesById = new Map(state.trackedClassesById).set(tc.id, newTc);
		}
	}
}

function updateCookie(state: ITrackerState): void {
	const allClasses = Array.from(state.trackedClassesById.values());
	const cookie: ICookie = {
		characters: allClasses.filter(isCharacter).map(c => ({
			name: c.name,
			characterClass: c.characterClass,
		})),
		monsters: allClasses.filter(isMonster).map(m => ({
			monsterClass: m.monsterClass,
		})),
	};
	// Simple and fairly effective deep object comparison, but not perfect
	if (JSON.stringify(cookie) !== JSON.stringify(state.cookie)) {
		state.cookie = cookie;
	}
}

function updateOnTrackedClassesChanged(state: ITrackerState): void {
	updateTieProps(state);
	updateCookie(state);
}
