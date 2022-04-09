import { ITrackableClass, ITrackableClassInfo } from "./TrackableClass";

export interface IMonster extends ITrackableClass<"monster"> {
	monsterClass: MonsterClass;
}

export function isMonster(trackableClass: ITrackableClass): trackableClass is IMonster {
	return trackableClass.type === "monster";
}

export enum MonsterClass {
	ancientArtillery = 1,
	banditArcher,
	banditGuard,
	blackImp,
	boss,
	caveBear,
	cityArcher,
	cityGuard,
	cultist,
	deepTerror,
	earthDemon,
	flameDemon,
	forestImp,
	frostDemon,
	giantViper,
	harrowerInfester,
	hound,
	inoxArcher,
	inoxGuard,
	inoxShaman,
	livingBones,
	livingCorpse,
	livingSpirit,
	lurker,
	nightDemon,
	ooze,
	rendingDrake,
	savvasIcestorm,
	savvasLavaflow,
	spittingDrake,
	stoneGolem,
	sunDemon,
	vermlingScout,
	vermlingShaman,
	viciousDrake,
	windDemon,
}
export interface IMonsterClassInfo extends ITrackableClassInfo {}

const monsterClassInfos: { [classId in MonsterClass]: IMonsterClassInfo } = {
	[MonsterClass.ancientArtillery]: {
		name: "Ancient Artillery",
	},
	[MonsterClass.banditArcher]: {
		name: "Bandit Archer",
	},
	[MonsterClass.banditGuard]: {
		name: "Bandit Guard",
	},
	[MonsterClass.blackImp]: {
		name: "Black Imp",
	},
	[MonsterClass.boss]: {
		name: "Boss",
	},
	[MonsterClass.caveBear]: {
		name: "Cave Bear",
	},
	[MonsterClass.cityArcher]: {
		name: "City Archer",
	},
	[MonsterClass.cityGuard]: {
		name: "City Guard",
	},
	[MonsterClass.cultist]: {
		name: "Cultist",
	},
	[MonsterClass.deepTerror]: {
		name: "Deep Terror",
	},
	[MonsterClass.earthDemon]: {
		name: "Earth Demon",
	},
	[MonsterClass.flameDemon]: {
		name: "Flame Demon",
	},
	[MonsterClass.forestImp]: {
		name: "Forest Imp",
	},
	[MonsterClass.frostDemon]: {
		name: "Frost Demon",
	},
	[MonsterClass.giantViper]: {
		name: "Giant Viper",
	},
	[MonsterClass.harrowerInfester]: {
		name: "Harrower Infester",
	},
	[MonsterClass.hound]: {
		name: "Hound",
	},
	[MonsterClass.inoxArcher]: {
		name: "Inox Archer",
	},
	[MonsterClass.inoxGuard]: {
		name: "Inox Guard",
	},
	[MonsterClass.inoxShaman]: {
		name: "Inox Shaman",
	},
	[MonsterClass.livingBones]: {
		name: "Living Bones",
	},
	[MonsterClass.livingCorpse]: {
		name: "Living Corpse",
	},
	[MonsterClass.livingSpirit]: {
		name: "Living Spirit",
	},
	[MonsterClass.lurker]: {
		name: "Lurker",
	},
	[MonsterClass.nightDemon]: {
		name: "Night Demon",
	},
	[MonsterClass.ooze]: {
		name: "Ooze",
	},
	[MonsterClass.rendingDrake]: {
		name: "Rending Drake",
	},
	[MonsterClass.savvasIcestorm]: {
		name: "Savvas Icestorm",
	},
	[MonsterClass.savvasLavaflow]: {
		name: "Savvas Lavaflow",
	},
	[MonsterClass.spittingDrake]: {
		name: "Spitting Drake",
	},
	[MonsterClass.stoneGolem]: {
		name: "Stone Golem",
	},
	[MonsterClass.sunDemon]: {
		name: "Sun Demon",
	},
	[MonsterClass.vermlingScout]: {
		name: "Vermling Scout",
	},
	[MonsterClass.vermlingShaman]: {
		name: "Vermling Shaman",
	},
	[MonsterClass.viciousDrake]: {
		name: "Vicious Drake",
	},
	[MonsterClass.windDemon]: {
		name: "Wind Demon",
	},
};

export function getMonsterName(classId: MonsterClass): string {
	return monsterClassInfos[classId].name;
}
