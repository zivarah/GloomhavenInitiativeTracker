import { ISummon } from "./Summon";
import { ITrackableClass, ITrackableClassInfo, TrackableClassType } from "./TrackableClass";

export interface ICharacter extends ITrackableClass<TrackableClassType.character> {
	characterClass: CharacterClass;
	activeSummons?: readonly ISummon[];
}

export function isCharacter(trackableClass: ITrackableClass): trackableClass is ICharacter {
	return trackableClass.type === TrackableClassType.character;
}

export enum CharacterClass {
	mindthief = 1,
	scoundrel,
	spellweaver,
	cragheart,
	brute,
	tinkerer,
}

export interface ICharacterClassInfo extends ITrackableClassInfo {
	iconKey: string;
}

const iconPath = process.env.PUBLIC_URL + "/images/characters/";

const characterClassInfos: { [classId in CharacterClass]: ICharacterClassInfo } = {
	[CharacterClass.mindthief]: {
		name: "Mindthief",
		iconKey: "mindthief.png",
	},
	[CharacterClass.scoundrel]: {
		name: "Scoundrel",
		iconKey: "scoundrel.png",
	},
	[CharacterClass.spellweaver]: {
		name: "Spellweaver",
		iconKey: "spellweaver.png",
	},
	[CharacterClass.cragheart]: {
		name: "Cragheart",
		iconKey: "cragheart.png",
	},
	[CharacterClass.brute]: {
		name: "Brute",
		iconKey: "brute.png",
	},
	[CharacterClass.tinkerer]: {
		name: "Tinkerer",
		iconKey: "tinkerer.png",
	},
};

export function getCharacterClassName(classId: CharacterClass): string {
	return characterClassInfos[classId].name;
}

export function getCharacterIcon(classId: CharacterClass): string | undefined {
	return iconPath + characterClassInfos[classId].iconKey;
}
