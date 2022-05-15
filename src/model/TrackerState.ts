import { ImmutableMap } from "../common/ImmutableMap";
import { isAlly } from "./Ally";
import { CharacterClass, getCharacterIcon, ICharacter, isCharacter } from "./Character";
import { getMonsterName, isMonster, MonsterClass } from "./Monster";
import { getCharacterAutoSummons, getSummonName, SummonClass } from "./Summon";
import { ITrackableClass, TrackableClassType } from "./TrackableClass";

export interface ITrackerState {
	readonly trackedClassesById: ReadonlyMap<number, ITrackableClass>;
	readonly orderedIds: readonly number[];
	readonly nextId: number;
	readonly phase: RoundPhase;
	readonly tieExists: boolean;
}

interface ITrackerStateInternal extends ITrackerState {
	readonly trackedClassesById: ImmutableMap<number, ITrackableClass>;
}

export interface ICookie {
	classes?: readonly CookieClass[];
}

type CookieClass =
	| { t: TrackableClassType.monster; mc: MonsterClass }
	| { t: TrackableClassType.character; cc: CharacterClass; n: string }
	| { t: TrackableClassType.summon; cc: CharacterClass; sc: SummonClass }
	| { t: TrackableClassType.ally; n: string };

export enum RoundPhase {
	choosingInitiative,
	initiativesChosen,
}

export function createStateFromCookie(cookie?: ICookie): TrackerState {
	const { classes = [] } = cookie ?? {};

	try {
		return classes.reduce((state, cc) => {
			switch (cc.t) {
				case TrackableClassType.character:
					return state.withCharacter(cc.n, cc.cc);
				case TrackableClassType.summon:
					// Safe because summons are always after the character in the cookie array
					return state.withSummon(cc.cc, cc.sc);
				case TrackableClassType.monster:
					return state.withMonster(cc.mc);
				case TrackableClassType.ally:
					return state.withAlly(cc.n);
				default:
					throw new Error("Invalid cookie");
			}
		}, TrackerState.initialState());
	} catch {
		return TrackerState.initialState();
	}
}

export function createCookieFromState(state: ITrackerState): ICookie {
	const classes = Array.from(state.trackedClassesById.values()).flatMap((tc: ITrackableClass): CookieClass[] => {
		if (isMonster(tc)) {
			return [{ t: TrackableClassType.monster, mc: tc.monsterClass }];
		}
		if (isCharacter(tc)) {
			const summons: CookieClass[] =
				tc.activeSummons?.map(summon => ({
					t: TrackableClassType.summon,
					cc: tc.characterClass,
					sc: summon.summonClass,
				})) ?? [];
			// Summons must always come after the character in the cookie array
			return [{ t: TrackableClassType.character, cc: tc.characterClass, n: tc.name }, ...summons];
		}
		if (isAlly(tc)) {
			return [{ t: TrackableClassType.ally, n: tc.name }];
		}
		return [];
	});

	return { classes };
}

export type TrackerDispatch = React.Dispatch<TrackerAction>;

export type TrackerAction =
	| { action: "addMonster"; monsterClass: MonsterClass }
	| { action: "addCharacter"; characterClass: CharacterClass; name: string }
	| { action: "addSummon"; characterClass: CharacterClass; summonClass: SummonClass }
	| { action: "addAlly"; name: string }
	| { action: "deleteTrackedClass"; id: number }
	| { action: "deleteSummon"; characterId: number; summonId: number }
	| { action: "setInitiative"; id: number; value: number | undefined }
	| { action: "setTurnComplete"; id: number; value: boolean }
	| { action: "setSummonTurnComplete"; id: number; characterId: number; value: boolean }
	| { action: "resetForNewRound" }
	| { action: "beginRound" }
	| { action: "shift"; id: number; direction: "up" | "down" };

export function updateTrackerState(prevState: TrackerState, action: TrackerAction): TrackerState {
	switch (action.action) {
		case "addMonster":
			return prevState.withMonster(action.monsterClass);
		case "addCharacter":
			return prevState.withCharacter(action.name, action.characterClass, true);
		case "addSummon":
			return prevState.withSummon(action.characterClass, action.summonClass);
		case "addAlly":
			return prevState.withAlly(action.name);
		case "deleteTrackedClass":
			return prevState.withoutTrackedClass(action.id);
		case "deleteSummon":
			return prevState.withoutSummon(action.characterId, action.summonId);
		case "setInitiative":
			return prevState.withClassInitiative(action.id, action.value);
		case "setTurnComplete":
			return prevState.withClassTurnComplete(action.id, action.value);
		case "setSummonTurnComplete":
			return prevState.withSummonTurnComplete(action.id, action.characterId, action.value);
		case "resetForNewRound":
			return prevState.resetForNewRound();
		case "beginRound":
			return prevState.beginRound();
		case "shift":
			return prevState.withCharacterShifted(action.id, action.direction);
	}
}

export class TrackerState implements ITrackerStateInternal {
	public readonly trackedClassesById: ImmutableMap<number, ITrackableClass>;
	public readonly orderedIds: readonly number[];
	public readonly nextId: number;
	public readonly phase: RoundPhase;
	public readonly tieExists: boolean;

	private constructor(fromState: ITrackerStateInternal) {
		this.nextId = fromState.nextId;
		this.trackedClassesById = fromState.trackedClassesById;
		this.orderedIds = fromState.orderedIds;
		this.phase = fromState.phase;
		this.tieExists = fromState.tieExists;
	}

	public static initialState(): TrackerState {
		return new TrackerState({
			trackedClassesById: ImmutableMap.empty(),
			orderedIds: [],
			nextId: 1,
			phase: RoundPhase.choosingInitiative,
			tieExists: false,
		});
	}

	//#region adding/removing tracked classes

	public withMonster(monsterClassId: MonsterClass): TrackerState {
		if (!(monsterClassId in MonsterClass)) {
			throw new Error("Invalid monster class");
		}
		return this.withNewTrackedClass({
			type: TrackableClassType.monster,
			name: getMonsterName(monsterClassId),
			monsterClass: monsterClassId,
		});
	}

	public withCharacter(name: string, characterClassId: CharacterClass, addAutoSummons?: boolean): TrackerState {
		if (!(characterClassId in CharacterClass)) {
			throw new Error(`Invalid character class: ${characterClassId}`);
		}
		let newState = this.withNewTrackedClass({
			type: TrackableClassType.character,
			name,
			characterClass: characterClassId,
			iconKey: getCharacterIcon(characterClassId),
		});
		if (addAutoSummons) {
			getCharacterAutoSummons(characterClassId).forEach(autoSummon => (newState = newState.withSummon(characterClassId, autoSummon)));
		}
		return newState;
	}

	public withSummon(characterClass: CharacterClass, summonClass: SummonClass): TrackerState {
		let character = this.getCharacterByClassId(characterClass);
		if (!character) {
			throw new Error(`Could not find character of class: ${characterClass}`);
		}

		const activeSummons = character.activeSummons ? [...character.activeSummons] : [];
		activeSummons.push({
			type: TrackableClassType.summon,
			id: this.nextId,
			characterId: character.id,
			summonClass,
			name: getSummonName(summonClass),
			turnComplete: this.phase === RoundPhase.initiativesChosen,
		});
		const newCharacter = {
			...character,
			activeSummons,
		};
		const trackedClassesById = this.trackedClassesById.set(character.id, newCharacter);
		return this.withNewProps({ trackedClassesById, nextId: this.nextId + 1 }, true);
	}

	public withAlly(name: string): TrackerState {
		return this.withNewTrackedClass({
			type: TrackableClassType.ally,
			name,
		});
	}

	public withoutTrackedClass(idToDelete: number): TrackerState {
		const trackedClassesById = this.trackedClassesById.delete(idToDelete);
		const orderedIds = this.orderedIds.filter(id => id !== idToDelete);
		return this.withNewProps({ trackedClassesById, orderedIds });
	}

	public withoutSummon(characterId: number, summonId: number): TrackerState {
		let character = this.trackedClassesById.get(characterId);
		if (!character || !isCharacter(character)) {
			throw new Error(`Could not find character with id: ${characterId}`);
		}
		const newCharacter = {
			...character,
			activeSummons: character.activeSummons?.filter(summon => summon.id !== summonId),
		};
		const trackedClassesById = this.trackedClassesById.set(character.id, newCharacter);
		return this.withNewProps({ trackedClassesById }, true);
	}

	private withNewTrackedClass<T extends Omit<ITrackableClass, "id">>(newTrackedClass: T): TrackerState {
		const id = this.nextId;
		const trackedClassesById = this.trackedClassesById.set(id, { ...newTrackedClass, id });
		const orderedIds = [...this.orderedIds, id];
		return this.withNewProps({
			nextId: id + 1,
			trackedClassesById,
			orderedIds,
		});
	}

	//#endregion adding/removing tracked classes

	//#region round/initiative
	public withClassInitiative(id: number, value: number | undefined): TrackerState {
		const trackedClass = this.trackedClassesById.get(id);
		if (!trackedClass) {
			throw new Error(`Could not find tracked class with id: ${id}`);
		}
		const trackedClassesById = this.trackedClassesById.set(id, { ...trackedClass, initiative: value });
		return this.withNewProps({ trackedClassesById });
	}

	public withClassTurnComplete(id: number, value: boolean): TrackerState {
		const trackedClass = this.trackedClassesById.get(id);
		if (!trackedClass) {
			throw new Error(`No tracked class found with id: ${id}`);
		}
		const trackedClassesById = this.trackedClassesById.set(id, { ...trackedClass, turnComplete: value });
		return this.withNewProps({ trackedClassesById });
	}

	public withSummonTurnComplete(id: number, characterId: number, value: boolean): TrackerState {
		const character = this.getCharacter(characterId);
		const newCharacter = {
			...character,
			activeSummons: character.activeSummons?.map(s => {
				if (s.id === id) {
					s = { ...s, turnComplete: value };
				}
				return s;
			}),
		};
		const trackedClassesById = this.trackedClassesById.set(character.id, newCharacter);
		return this.withNewProps({ trackedClassesById });
	}

	public resetForNewRound(): TrackerState {
		const trackedClassesById = this.trackedClassesById.updateValues(tc => {
			if (isCharacter(tc)) {
				tc = { ...tc, activeSummons: tc.activeSummons?.map(s => ({ ...s, turnComplete: false })) } as ICharacter;
			}
			return { ...tc, initiative: undefined, turnComplete: false };
		});
		return this.withNewProps(
			{
				trackedClassesById,
				phase: RoundPhase.choosingInitiative,
				tieExists: false,
			},
			true
		);
	}

	public beginRound(): TrackerState {
		const trackedClassesById = this.trackedClassesById.updateValues(tc => ({ ...tc, initiative: tc.initiative ?? 99 }));
		const orderedIds = [...Array.from(this.trackedClassesById.values())]
			.sort((a, b) => (a.initiative ?? 99) - (b.initiative ?? 99))
			.map(tc => tc.id);
		return this.withNewProps({ trackedClassesById, orderedIds, phase: RoundPhase.initiativesChosen });
	}

	public withCharacterShifted(id: number, direction: "up" | "down"): TrackerState {
		const index1 = this.orderedIds.indexOf(id);
		const index2 = direction === "up" ? index1 - 1 : index1 + 1;
		const id2 = this.orderedIds[index2];
		const orderedIds = [...this.orderedIds];
		orderedIds[index1] = id2;
		orderedIds[index2] = id;
		return this.withNewProps({ orderedIds });
	}
	//#endregion round/initiative

	//#region private helpers

	private getCharacterByClassId(classId: CharacterClass): ICharacter | undefined {
		return Array.from(this.trackedClassesById.values())
			.filter(isCharacter)
			.find(character => character.characterClass === classId);
	}

	private getCharacter(id: number): ICharacter {
		let character = this.trackedClassesById.get(id);
		if (!character || !isCharacter(character)) {
			throw new Error(`Could not find character with id: ${id}`);
		}
		return character;
	}

	private withNewProps(newProps: Partial<ITrackerStateInternal>, skipTieCalculation?: boolean): TrackerState {
		const newState = new TrackerState({
			trackedClassesById: this.trackedClassesById,
			orderedIds: this.orderedIds,
			nextId: this.nextId,
			phase: this.phase,
			tieExists: this.tieExists,
			...newProps,
		});
		if (skipTieCalculation) {
			return newState;
		}
		if (this.trackedClassesById === newProps.trackedClassesById && this.orderedIds === newProps.orderedIds) {
			return newState;
		}
		return newState.withUpdatedTieCalculations();
	}

	private withUpdatedTieCalculations(): TrackerState {
		let tieExists = false;
		let trackedClassesById = this.trackedClassesById;
		for (let i = 0; i < this.orderedIds.length; i++) {
			const tc = this.trackedClassesById.get(this.orderedIds[i]);

			const prev = i > 0 ? this.trackedClassesById.get(this.orderedIds[i - 1]) : undefined;
			const next = i < this.orderedIds.length ? this.trackedClassesById.get(this.orderedIds[i + 1]) : undefined;
			if (!tc) {
				throw new Error("tracker state corruption detected");
			}

			const tiedWithPrevious = prev && !!tc.initiative && tc.initiative === prev.initiative;
			const tiedWithNext = next && !!tc.initiative && tc.initiative === next.initiative;
			if (tiedWithNext || tiedWithPrevious) {
				tieExists = true;
			}

			if (!!tiedWithPrevious !== !!tc.tiedWithPrevious || !!tiedWithNext !== !!tc.tiedWithNext) {
				trackedClassesById = trackedClassesById.set(tc.id, { ...tc, tiedWithNext, tiedWithPrevious });
			}
		}

		return this.withNewProps({ trackedClassesById, tieExists }, true);
	}

	//#endregion private helpers
}
