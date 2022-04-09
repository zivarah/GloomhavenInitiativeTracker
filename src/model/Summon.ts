import { CharacterClass } from "./Character";
import { ITrackableClass, ITrackableClassInfo } from "./TrackableClass";

export interface ISummon extends ITrackableClass<"summon"> {
	/** The id of the character that summoned this summon */
	characterId: number;
	summonClass: SummonClass;
}

export function isSummon(trackableClass: ITrackableClass): trackableClass is ISummon {
	return trackableClass.type === "summon";
}

export enum SummonClass {
	steelConstruct = 1,
	skeleton,
	spiritWarrior,
	jadeFalcon,

	ratSwarm,
	monstrousRat,
	ratKing,

	mysticAlly,
	burningAvatar,

	decoy,
	battleBot,
	killBot,
}

export interface ISummonClassInfo extends ITrackableClassInfo {}
const summonClassInfos: { [classId in SummonClass]: ISummonClassInfo } = {
	[SummonClass.steelConstruct]: {
		name: "Steel Construct",
	},
	[SummonClass.skeleton]: {
		name: "Skeleton",
	},
	[SummonClass.spiritWarrior]: {
		name: "Spirit Warrior",
	},
	[SummonClass.jadeFalcon]: {
		name: "Jade Falcon",
	},
	[SummonClass.ratSwarm]: {
		name: "Rat Swarm",
	},
	[SummonClass.monstrousRat]: {
		name: "Monstrous Rat",
	},
	[SummonClass.ratKing]: {
		name: "Rat King",
	},
	[SummonClass.mysticAlly]: {
		name: "Mystic Ally",
	},
	[SummonClass.burningAvatar]: {
		name: "Burning Avatar",
	},
	[SummonClass.decoy]: {
		name: "Decoy",
	},
	[SummonClass.battleBot]: {
		name: "Battle Bot",
	},
	[SummonClass.killBot]: {
		name: "Kill Bot",
	},
};

const classSummons: { [characterClass in CharacterClass]?: SummonClass[] } = {
	[CharacterClass.mindthief]: [SummonClass.ratSwarm, SummonClass.monstrousRat, SummonClass.ratKing],
	[CharacterClass.spellweaver]: [SummonClass.mysticAlly, SummonClass.burningAvatar],
	[CharacterClass.tinkerer]: [SummonClass.decoy, SummonClass.battleBot, SummonClass.killBot],
};

export function getSummonName(classId: SummonClass): string {
	return summonClassInfos[classId].name;
}
export function getCharacterSummonables(classId: CharacterClass): SummonClass[] {
	return [...(classSummons[classId] ?? []), ...itemSummonables];
}

export const itemSummonables = [SummonClass.steelConstruct, SummonClass.skeleton, SummonClass.spiritWarrior, SummonClass.jadeFalcon];
