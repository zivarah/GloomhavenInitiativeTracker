import { ISummon } from "./Summon";
import { ITrackableClass, ITrackableClassInfo } from "./TrackableClass";

export interface ICharacter extends ITrackableClass<"character"> {
	characterClass: CharacterClass;
	activeSummons?: readonly ISummon[];
}

export function isCharacter(trackableClass: ITrackableClass): trackableClass is ICharacter {
	return trackableClass.type === "character";
}

export enum CharacterClass {
	mindthief = 1,
	scoundrel,
	spellweaver,
	cragheart,
	brute,
	tinkerer,
}

export interface ICharacterClassInfo<T extends CharacterClass = CharacterClass> extends ITrackableClassInfo {
	classId: T;
	summonableAllies?: string[];
}

const iconPath = process.env.PUBLIC_URL + "/images/characters/";

export const characterClassInfos: { [classId in CharacterClass]: ICharacterClassInfo<classId> } = {
	[CharacterClass.mindthief]: {
		classId: CharacterClass.mindthief,
		name: "Mindthief",
		iconKey: "mindthief.png",
		summonableAllies: ["Rat Swarm", "Monstrous Rat", "Rat King"],
	},
	[CharacterClass.scoundrel]: {
		classId: CharacterClass.scoundrel,
		name: "Scoundrel",
		iconKey: "scoundrel.png",
	},
	[CharacterClass.spellweaver]: {
		classId: CharacterClass.spellweaver,
		name: "Spellweaver",
		iconKey: "spellweaver.png",
		summonableAllies: ["Mystic Ally", "Burning Avatar"],
	},
	[CharacterClass.cragheart]: {
		classId: CharacterClass.cragheart,
		name: "Cragheart",
		iconKey: "cragheart.png",
	},
	[CharacterClass.brute]: {
		classId: CharacterClass.brute,
		name: "Brute",
		iconKey: "brute.png",
	},
	[CharacterClass.tinkerer]: {
		classId: CharacterClass.tinkerer,
		name: "Tinkerer",
		iconKey: "tinkerer.png",
		summonableAllies: ["Decoy", "Battle Bot", "Kill Bot"],
	},
};

export function getCharacterIcon(classId: CharacterClass): string | undefined {
	return iconPath + characterClassInfos[classId].iconKey;
}
