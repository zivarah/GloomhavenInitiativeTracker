import { ITrackableClass, ITrackableClassInfo } from "./TrackableClass";

export interface ICharacter extends ITrackableClass {
	type: "character";
	characterClassId: CharacterClass;
}

export function isCharacter(trackableClass: ITrackableClass): trackableClass is ICharacter {
	return (trackableClass as ICharacter).type === "character";
}

export enum CharacterClass {
	mindthief,
	scoundrel,
	spellweaver,
	cragheart,
	brute,
	tinkerer,
}

export interface ICharacterClassInfo<T extends CharacterClass = CharacterClass> extends ITrackableClassInfo {
	classId: T;
}

const iconPath = process.env.PUBLIC_URL + "/images/characters/";

export const characterClassInfos: { [classId in CharacterClass]: ICharacterClassInfo<classId> } = {
	[CharacterClass.mindthief]: {
		classId: CharacterClass.mindthief,
		name: "Mindthief",
		iconKey: iconPath + "mindthief.png",
	},
	[CharacterClass.scoundrel]: {
		classId: CharacterClass.scoundrel,
		name: "Scoundrel",
		iconKey: iconPath + "scoundrel.png",
	},
	[CharacterClass.spellweaver]: {
		classId: CharacterClass.spellweaver,
		name: "Spellweaver",
		iconKey: iconPath + "spellweaver.png",
	},
	[CharacterClass.cragheart]: {
		classId: CharacterClass.cragheart,
		name: "Cragheart",
		iconKey: iconPath + "cragheart.png",
	},
	[CharacterClass.brute]: {
		classId: CharacterClass.brute,
		name: "Brute",
		iconKey: iconPath + "brute.png",
	},
	[CharacterClass.tinkerer]: {
		classId: CharacterClass.tinkerer,
		name: "Tinkerer",
		iconKey: iconPath + "tinkerer.png",
	},
};
