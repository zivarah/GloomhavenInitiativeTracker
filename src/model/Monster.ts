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
export interface IMonsterClassInfo<T extends MonsterClass = MonsterClass> extends ITrackableClassInfo {
	classId: T;
}

export const monsterClassInfos: { [classId in MonsterClass]: IMonsterClassInfo<classId> } = {
	[MonsterClass.ancientArtillery]: {
		classId: MonsterClass.ancientArtillery,
		name: "Ancient Artillery",
		//iconKey: "monsters/ancientArtillery.png",
	},
	[MonsterClass.banditArcher]: {
		classId: MonsterClass.banditArcher,
		name: "Bandit Archer",
		//iconKey: "monsters/banditArcher.png",
	},
	[MonsterClass.banditGuard]: {
		classId: MonsterClass.banditGuard,
		name: "Bandit Guard",
		//iconKey: "monsters/banditGuard.png",
	},
	[MonsterClass.blackImp]: {
		classId: MonsterClass.blackImp,
		name: "Black Imp",
		//iconKey: "monsters/blackImp.png",
	},
	[MonsterClass.boss]: {
		classId: MonsterClass.boss,
		name: "Boss",
		//iconKey: "monsters/boss.png",
	},
	[MonsterClass.caveBear]: {
		classId: MonsterClass.caveBear,
		name: "Cave Bear",
		//iconKey: "monsters/caveBear.png",
	},
	[MonsterClass.cityArcher]: {
		classId: MonsterClass.cityArcher,
		name: "City Archer",
		//iconKey: "monsters/cityArcher.png",
	},
	[MonsterClass.cityGuard]: {
		classId: MonsterClass.cityGuard,
		name: "City Guard",
		//iconKey: "monsters/cityGuard.png",
	},
	[MonsterClass.cultist]: {
		classId: MonsterClass.cultist,
		name: "Cultist",
		//iconKey: "monsters/cultist.png",
	},
	[MonsterClass.deepTerror]: {
		classId: MonsterClass.deepTerror,
		name: "Deep Terror",
		//iconKey: "monsters/deepTerror.png",
	},
	[MonsterClass.earthDemon]: {
		classId: MonsterClass.earthDemon,
		name: "Earth Demon",
		//iconKey: "monsters/earthDemon.png",
	},
	[MonsterClass.flameDemon]: {
		classId: MonsterClass.flameDemon,
		name: "Flame Demon",
		//iconKey: "monsters/flameDemon.png",
	},
	[MonsterClass.forestImp]: {
		classId: MonsterClass.forestImp,
		name: "Forest Imp",
		//iconKey: "monsters/forestImp.png",
	},
	[MonsterClass.frostDemon]: {
		classId: MonsterClass.frostDemon,
		name: "Frost Demon",
		//iconKey: "monsters/frostDemon.png",
	},
	[MonsterClass.giantViper]: {
		classId: MonsterClass.giantViper,
		name: "Giant Viper",
		//iconKey: "monsters/giantViper.png",
	},
	[MonsterClass.harrowerInfester]: {
		classId: MonsterClass.harrowerInfester,
		name: "Harrower Infester",
		//iconKey: "monsters/harrowerInfester.png",
	},
	[MonsterClass.hound]: {
		classId: MonsterClass.hound,
		name: "Hound",
		//iconKey: "monsters/hound.png",
	},
	[MonsterClass.inoxArcher]: {
		classId: MonsterClass.inoxArcher,
		name: "Inox Archer",
		//iconKey: "monsters/inoxArcher.png",
	},
	[MonsterClass.inoxGuard]: {
		classId: MonsterClass.inoxGuard,
		name: "Inox Guard",
		//iconKey: "monsters/inoxGuard.png",
	},
	[MonsterClass.livingBones]: {
		classId: MonsterClass.livingBones,
		name: "Living Bones",
		//iconKey: "monsters/livingBones.png",
	},
	[MonsterClass.livingCorpse]: {
		classId: MonsterClass.livingCorpse,
		name: "Living Corpse",
		//iconKey: "monsters/livingCorpse.png",
	},
	[MonsterClass.livingSpirit]: {
		classId: MonsterClass.livingSpirit,
		name: "Living Spirit",
		//iconKey: "monsters/livingSpirit.png",
	},
	[MonsterClass.lurker]: {
		classId: MonsterClass.lurker,
		name: "Lurker",
		//iconKey: "monsters/lurker.png",
	},
	[MonsterClass.nightDemon]: {
		classId: MonsterClass.nightDemon,
		name: "Night Demon",
		//iconKey: "monsters/nightDemon.png",
	},
	[MonsterClass.ooze]: {
		classId: MonsterClass.ooze,
		name: "Ooze",
		//iconKey: "monsters/ooze.png",
	},
	[MonsterClass.rendingDrake]: {
		classId: MonsterClass.rendingDrake,
		name: "Rending Drake",
		//iconKey: "monsters/rendingDrake.png",
	},
	[MonsterClass.savvasIcestorm]: {
		classId: MonsterClass.savvasIcestorm,
		name: "Savvas Icestorm",
		//iconKey: "monsters/savvasIcestorm.png",
	},
	[MonsterClass.savvasLavaflow]: {
		classId: MonsterClass.savvasLavaflow,
		name: "Savvas Lavaflow",
		//iconKey: "monsters/savvasLavaflow.png",
	},
	[MonsterClass.spittingDrake]: {
		classId: MonsterClass.spittingDrake,
		name: "Spitting Drake",
		//iconKey: "monsters/spittingDrake.png",
	},
	[MonsterClass.stoneGolem]: {
		classId: MonsterClass.stoneGolem,
		name: "Stone Golem",
		//iconKey: "monsters/stoneGolem.png",
	},
	[MonsterClass.sunDemon]: {
		classId: MonsterClass.sunDemon,
		name: "Sun Demon",
		//iconKey: "monsters/sunDemon.png",
	},
	[MonsterClass.vermlingScout]: {
		classId: MonsterClass.vermlingScout,
		name: "Vermling Scout",
		//iconKey: "monsters/vermlingScout.png",
	},
	[MonsterClass.vermlingShaman]: {
		classId: MonsterClass.vermlingShaman,
		name: "Vermling Shaman",
		//iconKey: "monsters/vermlingShaman.png",
	},
	[MonsterClass.viciousDrake]: {
		classId: MonsterClass.viciousDrake,
		name: "Vicious Drake",
		//iconKey: "monsters/viciousDrake.png",
	},
	[MonsterClass.windDemon]: {
		classId: MonsterClass.windDemon,
		name: "Wind Demon",
		//iconKey: "monsters/windDemon.png",
	},
};
