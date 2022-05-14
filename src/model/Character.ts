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
	doomstalker,
	plagueherald,
}

export interface ICharacterClassInfo extends ITrackableClassInfo {
	iconKey: string;
	spoilerAlias?: string;
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
	[CharacterClass.doomstalker]: {
		name: "Doomstalker",
		iconKey: "doomstalker.png",
		spoilerAlias: "Angry Face",
	},
	[CharacterClass.plagueherald]: {
		name: "Plagueherald",
		iconKey: "plagueherald.png",
		spoilerAlias: "Cthulu",
	},
};

// To convert all webp icons into trimmed, resized PNGs:
// mogrify -format png -trim -resize 48x48 *.webp

export function getCharacterClassName(classId: CharacterClass): string {
	return characterClassInfos[classId].name;
}

export function getCharacterSpoilerAlias(classId: CharacterClass): string | undefined {
	return characterClassInfos[classId].spoilerAlias;
}

export function getCharacterIcon(classId: CharacterClass): string | undefined {
	return iconPath + characterClassInfos[classId].iconKey;
}
