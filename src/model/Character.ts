import { ISummon } from "./Summon";
import { ITrackableClass, ITrackableClassInfo, TrackableClassType } from "./TrackableClass";

export interface ICharacter extends ITrackableClass<TrackableClassType.character> {
	readonly characterClass: CharacterClass;
	readonly activeSummons?: readonly ISummon[];
}

export function isCharacter(trackableClass: ITrackableClass): trackableClass is ICharacter {
	return trackableClass.type === TrackableClassType.character;
}

export enum CharacterClass {
	beastTyrant = 1,
	berserker,
	brute,
	cragheart,
	doomstalker,
	elementalist,
	mindthief,
	nightshroud,
	plagueherald,
	quartermaster,
	sawbones,
	scoundrel,
	soothsinger,
	spellweaver,
	summoner,
	sunkeeper,
	tinkerer,
}

export interface ICharacterClassInfo extends ITrackableClassInfo {
	iconKey: string;
	spoilerAlias?: string;
}

const iconPath = process.env.PUBLIC_URL + "/images/characters/";

const characterClassInfos: { [classId in CharacterClass]: ICharacterClassInfo } = {
	[CharacterClass.beastTyrant]: {
		name: "Beast Tyrant",
		iconKey: "beastTyrant.png",
		spoilerAlias: "Two Minis",
	},
	[CharacterClass.berserker]: {
		name: "Berserker",
		iconKey: "berserker.png",
		spoilerAlias: "Lightning Bolt",
	},
	[CharacterClass.brute]: {
		name: "Brute",
		iconKey: "brute.png",
	},
	[CharacterClass.cragheart]: {
		name: "Cragheart",
		iconKey: "cragheart.png",
	},
	[CharacterClass.doomstalker]: {
		name: "Doomstalker",
		iconKey: "doomstalker.png",
		spoilerAlias: "Angry Face",
	},
	[CharacterClass.elementalist]: {
		name: "Elementalist",
		iconKey: "elementalist.png",
		spoilerAlias: "Triforce",
	},
	[CharacterClass.mindthief]: {
		name: "Mindthief",
		iconKey: "mindthief.png",
	},
	[CharacterClass.nightshroud]: {
		name: "Nightshroud",
		iconKey: "nightshroud.png",
		spoilerAlias: "Eclipse",
	},
	[CharacterClass.plagueherald]: {
		name: "Plagueherald",
		iconKey: "plagueherald.png",
		spoilerAlias: "Cthulu",
	},
	[CharacterClass.quartermaster]: {
		name: "Quartermaster",
		iconKey: "quartermaster.png",
		spoilerAlias: "Three Spears",
	},
	[CharacterClass.sawbones]: {
		name: "Sawbones",
		iconKey: "sawbones.png",
		spoilerAlias: "Saw",
	},
	[CharacterClass.scoundrel]: {
		name: "Scoundrel",
		iconKey: "scoundrel.png",
	},
	[CharacterClass.soothsinger]: {
		name: "Soothsinger",
		iconKey: "soothsinger.png",
		spoilerAlias: "Music Note",
	},
	[CharacterClass.spellweaver]: {
		name: "Spellweaver",
		iconKey: "spellweaver.png",
	},
	[CharacterClass.summoner]: {
		name: "Summoner",
		iconKey: "summoner.png",
		spoilerAlias: "Circles",
	},
	[CharacterClass.sunkeeper]: {
		name: "Sunkeeper",
		iconKey: "sunkeeper.png",
		spoilerAlias: "Sun",
	},
	[CharacterClass.tinkerer]: {
		name: "Tinkerer",
		iconKey: "tinkerer.png",
	},
};

// To trim to the correct 48x48 size:
// convert -trim -background white -gravity center -resize 48x48 -extent 48x48 berserker.png berserker.png
// To remove transparency:
// convert sunkeeper.png -background white -flatten sunkeeper.png
// To fully black & white something:
// convert doomstalker.png -threshold 50% doomstalker.png

export function getCharacterClassName(classId: CharacterClass): string {
	return characterClassInfos[classId].name;
}

export function getCharacterSpoilerAlias(classId: CharacterClass): string | undefined {
	return characterClassInfos[classId].spoilerAlias;
}

export function getCharacterIcon(classId: CharacterClass): string | undefined {
	return iconPath + characterClassInfos[classId].iconKey;
}
