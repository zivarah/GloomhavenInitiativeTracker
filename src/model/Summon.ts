import { CharacterClass } from "./Character";
import { ITrackableClass, ITrackableClassInfo, TrackableClassType } from "./TrackableClass";

export interface ISummon extends ITrackableClass<TrackableClassType.summon> {
	/** The id of the character that summoned this summon */
	readonly characterId: number;
	readonly summonClass: SummonClass;
}

export function isSummon(trackableClass: ITrackableClass): trackableClass is ISummon {
	return trackableClass.type === TrackableClassType.summon;
}

export enum SummonClass {
	// Items
	steelConstruct = 1,
	skeleton,
	spiritWarrior,
	jadeFalcon,

	// Mindthief
	ratSwarm,
	monstrousRat,
	ratKing,

	// Spellweaver
	mysticAlly,
	burningAvatar,

	// Tinkerer
	decoy,
	battleBot,
	killBot,

	// Beast Tyrant
	bear,
	greenAdder,
	tatteredWolf,
	redFalcon,
	swampAlligator,
	monolith,
	windTotem,
	spiritBanner,

	// Doomstalker
	warHawk,
	battleBoar,
	viciousJackal,
	giantToad,
	spittingCobra,

	// Elementalist
	doppelganger,
	manaSphere,

	// Summoner
	ironBeast,
	thornShooter,
	shadowWolves,
	lavaGolem,
	batSwarm,
	livingBomb,
	slimeSpirit,
	rockColossus,
	healingSprite,
	nailSpheres,
	voidEater,
	blackUnicorn,
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
	[SummonClass.bear]: {
		name: "Bear",
	},
	[SummonClass.greenAdder]: {
		name: "Green Adder",
	},
	[SummonClass.tatteredWolf]: {
		name: "Tattered Wolf",
	},
	[SummonClass.redFalcon]: {
		name: "Red Falcon",
	},
	[SummonClass.swampAlligator]: {
		name: "Swamp Alligator",
	},
	[SummonClass.monolith]: {
		name: "Monolith",
	},
	[SummonClass.windTotem]: {
		name: "Wind Totem",
	},
	[SummonClass.spiritBanner]: {
		name: "Spirit Banner",
	},
	[SummonClass.warHawk]: {
		name: "War Hawk",
	},
	[SummonClass.battleBoar]: {
		name: "Battle Boar",
	},
	[SummonClass.viciousJackal]: {
		name: "Vicious Jackal",
	},
	[SummonClass.giantToad]: {
		name: "Giant Toad",
	},
	[SummonClass.spittingCobra]: {
		name: "Spitting Cobra",
	},
	[SummonClass.doppelganger]: {
		name: "Doppelganger",
	},
	[SummonClass.manaSphere]: {
		name: "Mana Sphere",
	},
	[SummonClass.ironBeast]: {
		name: "Iron Beast",
	},
	[SummonClass.thornShooter]: {
		name: "Thorn Shooter",
	},
	[SummonClass.shadowWolves]: {
		name: "Shadow Wolves",
	},
	[SummonClass.lavaGolem]: {
		name: "Lava Golem",
	},
	[SummonClass.batSwarm]: {
		name: "Bat Swarm",
	},
	[SummonClass.livingBomb]: {
		name: "Living Bomb",
	},
	[SummonClass.slimeSpirit]: {
		name: "Slime Spirit",
	},
	[SummonClass.rockColossus]: {
		name: "Rock Colossus",
	},
	[SummonClass.healingSprite]: {
		name: "Healing Sprite",
	},
	[SummonClass.nailSpheres]: {
		name: "Nail Spheres",
	},
	[SummonClass.voidEater]: {
		name: "Void Eater",
	},
	[SummonClass.blackUnicorn]: {
		name: "Black Unicorn",
	},
};

const classSummons: { [characterClass in CharacterClass]?: SummonClass[] } = {
	[CharacterClass.mindthief]: [SummonClass.ratSwarm, SummonClass.monstrousRat, SummonClass.ratKing],
	[CharacterClass.spellweaver]: [SummonClass.mysticAlly, SummonClass.burningAvatar],
	[CharacterClass.tinkerer]: [SummonClass.decoy, SummonClass.battleBot, SummonClass.killBot],
	[CharacterClass.beastTyrant]: [
		SummonClass.bear,
		SummonClass.greenAdder,
		SummonClass.tatteredWolf,
		SummonClass.redFalcon,
		SummonClass.swampAlligator,
		SummonClass.monolith,
		SummonClass.windTotem,
		SummonClass.spiritBanner,
	],
	[CharacterClass.doomstalker]: [
		SummonClass.warHawk,
		SummonClass.battleBoar,
		SummonClass.viciousJackal,
		SummonClass.giantToad,
		SummonClass.spittingCobra,
	],
	[CharacterClass.elementalist]: [SummonClass.doppelganger, SummonClass.manaSphere],
	[CharacterClass.summoner]: [
		SummonClass.ironBeast,
		SummonClass.thornShooter,
		SummonClass.shadowWolves,
		SummonClass.lavaGolem,
		SummonClass.batSwarm,
		SummonClass.livingBomb,
		SummonClass.slimeSpirit,
		SummonClass.rockColossus,
		SummonClass.healingSprite,
		SummonClass.nailSpheres,
		SummonClass.voidEater,
		SummonClass.blackUnicorn,
	],
};

const classAutoSummons: { [characterClass in CharacterClass]?: SummonClass[] } = {
	[CharacterClass.beastTyrant]: [SummonClass.bear],
};

export function getSummonName(classId: SummonClass): string {
	return summonClassInfos[classId].name;
}
export function getCharacterSummonables(classId: CharacterClass): SummonClass[] {
	return [...(classSummons[classId] ?? []), ...itemSummonables];
}
export function getCharacterAutoSummons(classId: CharacterClass): SummonClass[] {
	return classAutoSummons[classId] ?? [];
}

export const itemSummonables = [SummonClass.steelConstruct, SummonClass.skeleton, SummonClass.spiritWarrior, SummonClass.jadeFalcon];
