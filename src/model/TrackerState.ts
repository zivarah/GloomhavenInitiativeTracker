import { getEnumValues } from "../common/EnumUtils";
import { isBoolean, isNumber, isString } from "../common/TypeGuards";
import { IAlly } from "./Ally";
import { CharacterClass, getCharacterIcon, ICharacter, isCharacter } from "./Character";
import { getMonsterName, IMonster, MonsterClass } from "./Monster";
import { ITrackableClass } from "./TrackableClass";

export interface ITrackerState {
	trackedClassesById: ReadonlyMap<number, ITrackableClass>;
	orderedIds: readonly number[];
	nextId: number;
	phase: RoundPhase;
	tieExistsBetweenAny: boolean;
}

export interface ICookie {
	state?: {
		trackedClassesById: readonly (readonly [number, ITrackableClass])[];
		orderedIds: readonly number[];
		nextId: number;
		phase: RoundPhase;
		tieExistsBetweenAny: boolean;
	};
}

export enum RoundPhase {
	choosingInitiative,
	initiativesChosen,
}

export function createInitialState(cookie?: ICookie): ITrackerState {
	if (cookieIsValid(cookie)) {
		return { ...cookie.state, trackedClassesById: new Map(cookie.state.trackedClassesById) };
	}
	return {
		trackedClassesById: new Map<number, ITrackableClass>(),
		orderedIds: [],
		nextId: 1,
		phase: RoundPhase.choosingInitiative,
		tieExistsBetweenAny: false,
	};
}

function cookieIsValid(cookie?: ICookie): cookie is Required<ICookie> {
	if (!cookie?.state) {
		return false;
	}
	const { trackedClassesById, orderedIds, nextId, phase, tieExistsBetweenAny } = cookie.state;

	if (
		!Array.isArray(trackedClassesById) ||
		!trackedClassesById.every(
			idAndClass => Array.isArray(idAndClass) && isNumber(idAndClass[0]) && trackableClassIsValid(idAndClass[1])
		)
	) {
		return false;
	}
	if (!Array.isArray(orderedIds) || !orderedIds.every(isNumber)) {
		return false;
	}
	if (!isNumber(nextId)) {
		return false;
	}
	if (!getEnumValues(RoundPhase).includes(phase)) {
		return false;
	}
	if (!isBoolean(tieExistsBetweenAny)) {
		return false;
	}
	return true;
}

function trackableClassIsValid(tc: ITrackableClass): boolean {
	// TODO: could/maybe should make sure all non-required props are also correct,
	// and make sure extra character/monster/summon props are correct as well.
	return isNumber(tc.id) && isString(tc.name) && isString(tc.type);
}

export type TrackerDispatch = React.Dispatch<TrackerAction>;

export type TrackerAction =
	| { action: "addMonster"; monsterClass: MonsterClass }
	| { action: "addCharacter"; characterClass: CharacterClass; name: string }
	| { action: "addSummon"; characterClass: CharacterClass; name: string }
	| { action: "addAlly"; name: string }
	| { action: "deleteTrackedClass"; id: number }
	| { action: "deleteSummon"; characterId: number; summonId: number }
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
		case "addSummon":
			addSummon(newState, action.characterClass, action.name);
			break;
		case "addAlly":
			addAlly(newState, action.name);
			break;
		case "deleteTrackedClass":
			deleteTrackedClass(newState, action.id);
			break;
		case "deleteSummon":
			deleteSummon(newState, action.characterId, action.summonId);
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

function addMonster(state: ITrackerState, monsterClassId: MonsterClass): void {
	const newMonster: IMonster = {
		type: "monster",
		id: state.nextId++,
		name: getMonsterName(monsterClassId),
		monsterClass: monsterClassId,
	};
	state.trackedClassesById = new Map(state.trackedClassesById).set(newMonster.id, newMonster);
	state.orderedIds = [...state.orderedIds, newMonster.id];
	updateOnTrackedClassesChanged(state);
}

function addCharacter(state: ITrackerState, name: string, characterClassId: CharacterClass): void {
	const newCharacter: ICharacter = {
		type: "character",
		id: state.nextId++,
		name,
		characterClass: characterClassId,
		iconKey: getCharacterIcon(characterClassId),
	};

	state.trackedClassesById = new Map(state.trackedClassesById).set(newCharacter.id, newCharacter);
	state.orderedIds = [...state.orderedIds, newCharacter.id];
	updateOnTrackedClassesChanged(state);
}

function addAlly(state: ITrackerState, name: string): void {
	const newAlly: IAlly = {
		type: "ally",
		id: state.nextId++,
		name,
	};

	state.trackedClassesById = new Map(state.trackedClassesById).set(newAlly.id, newAlly);
	state.orderedIds = [...state.orderedIds, newAlly.id];
	updateOnTrackedClassesChanged(state);
}

function addSummon(state: ITrackerState, characterClass: CharacterClass, name: string): void {
	let character = getCharacterByClassId(state, characterClass);
	if (character) {
		const activeSummons = character.activeSummons ? [...character.activeSummons] : [];
		activeSummons.push({
			type: "summon",
			id: state.nextId++,
			characterId: character.id,
			name,
			turnComplete: state.phase === RoundPhase.initiativesChosen,
		});
		const newCharacter = {
			...character,
			activeSummons,
		};
		const newTrackedClassesById = new Map(state.trackedClassesById).set(character.id, newCharacter);
		state.trackedClassesById = newTrackedClassesById;
	}
}

function deleteSummon(state: ITrackerState, characterId: number, summonId: number): void {
	let character = state.trackedClassesById.get(characterId);
	if (character && isCharacter(character)) {
		const newCharacter = {
			...character,
			activeSummons: character.activeSummons?.filter(summon => summon.id !== summonId),
		};
		const newTrackedClassesById = new Map(state.trackedClassesById).set(character.id, newCharacter);
		state.trackedClassesById = newTrackedClassesById;
	}
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
	} else {
		setSummonTurnComplete(state, id, value);
	}
}

function setSummonTurnComplete(state: ITrackerState, id: number, value: boolean): void {
	const character = Array.from(state.trackedClassesById.values())
		.filter(isCharacter)
		.find(c => c.activeSummons?.some(s => s.id === id));
	if (character) {
		const newCharacter = {
			...character,
			activeSummons: character.activeSummons?.map(s => {
				if (s.id === id) {
					s = { ...s, turnComplete: value };
				}
				return s;
			}),
		};
		const newTrackedClassesById = new Map(state.trackedClassesById).set(character.id, newCharacter);
		state.trackedClassesById = newTrackedClassesById;
	}
}

function resetForNewRound(state: ITrackerState): void {
	const newTrackedClassesById = new Map(state.trackedClassesById);
	state.trackedClassesById.forEach((tc, id) => {
		if (isCharacter(tc)) {
			tc.activeSummons = tc.activeSummons?.map(s => ({ ...s, turnComplete: false }));
		}
		newTrackedClassesById.set(id, { ...tc, initiative: undefined, turnComplete: false });
	});
	state.trackedClassesById = newTrackedClassesById;
	state.phase = RoundPhase.choosingInitiative;
	state.tieExistsBetweenAny = false;
}

function beginRound(state: ITrackerState): void {
	const newTrackedClassesById = new Map(state.trackedClassesById);
	state.trackedClassesById.forEach((tc, id) => {
		newTrackedClassesById.set(id, { ...tc, initiative: tc.initiative ?? 99 });
	});
	state.trackedClassesById = newTrackedClassesById;
	state.orderedIds = [...Array.from(state.trackedClassesById.values())]
		.sort((a, b) => (a.initiative ?? 99) - (b.initiative ?? 99))
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
	state.tieExistsBetweenAny = false;
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
		if (newTc.tiedWithNext || newTc.tiedWithPrevious) {
			state.tieExistsBetweenAny = true;
		}

		if (!!newTc.tiedWithPrevious !== !!tc.tiedWithPrevious || !!newTc.tiedWithNext !== !!tc.tiedWithNext) {
			state.trackedClassesById = new Map(state.trackedClassesById).set(tc.id, newTc);
		}
	}
}

function updateOnTrackedClassesChanged(state: ITrackerState): void {
	updateTieProps(state);
}

function getCharacterByClassId(state: ITrackerState, classId: CharacterClass): ICharacter | undefined {
	return Array.from(state.trackedClassesById.values())
		.filter(isCharacter)
		.find(character => character.characterClass === classId);
}
