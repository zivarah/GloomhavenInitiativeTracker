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

export const monsterClassInfos: { [classId in MonsterClass]: IMonsterClassInfo } = {
	[MonsterClass.ancientArtillery]: {
		name: "Ancient Artillery",
		//iconKey: "monsters/ancientArtillery.png",
	},
	[MonsterClass.banditArcher]: {
		name: "Bandit Archer",
		//iconKey: "monsters/banditArcher.png",
	},
	[MonsterClass.banditGuard]: {
		name: "Bandit Guard",
		//iconKey: "monsters/banditGuard.png",
	},
	[MonsterClass.blackImp]: {
		name: "Black Imp",
		//iconKey: "monsters/blackImp.png",
	},
	[MonsterClass.boss]: {
		name: "Boss",
		//iconKey: "monsters/boss.png",
	},
	[MonsterClass.caveBear]: {
		name: "Cave Bear",
		//iconKey: "monsters/caveBear.png",
	},
	[MonsterClass.cityArcher]: {
		name: "City Archer",
		//iconKey: "monsters/cityArcher.png",
	},
	[MonsterClass.cityGuard]: {
		name: "City Guard",
		//iconKey: "monsters/cityGuard.png",
	},
	[MonsterClass.cultist]: {
		name: "Cultist",
		//iconKey: "monsters/cultist.png",
	},
	[MonsterClass.deepTerror]: {
		name: "Deep Terror",
		//iconKey: "monsters/deepTerror.png",
	},
	[MonsterClass.earthDemon]: {
		name: "Earth Demon",
		//iconKey: "monsters/earthDemon.png",
	},
	[MonsterClass.flameDemon]: {
		name: "Flame Demon",
		//iconKey: "monsters/flameDemon.png",
	},
	[MonsterClass.forestImp]: {
		name: "Forest Imp",
		//iconKey: "monsters/forestImp.png",
	},
	[MonsterClass.frostDemon]: {
		name: "Frost Demon",
		//iconKey: "monsters/frostDemon.png",
	},
	[MonsterClass.giantViper]: {
		name: "Giant Viper",
		//iconKey: "monsters/giantViper.png",
	},
	[MonsterClass.harrowerInfester]: {
		name: "Harrower Infester",
		//iconKey: "monsters/harrowerInfester.png",
	},
	[MonsterClass.hound]: {
		name: "Hound",
		//iconKey: "monsters/hound.png",
	},
	[MonsterClass.inoxArcher]: {
		name: "Inox Archer",
		//iconKey: "monsters/inoxArcher.png",
	},
	[MonsterClass.inoxGuard]: {
		name: "Inox Guard",
		//iconKey: "monsters/inoxGuard.png",
	},
	[MonsterClass.inoxShaman]: {
		name: "Inox Shaman",
		//iconKey: "monsters/inoxShaman.png",
	},
	[MonsterClass.livingBones]: {
		name: "Living Bones",
		//iconKey: "monsters/livingBones.png",
	},
	[MonsterClass.livingCorpse]: {
		name: "Living Corpse",
		//iconKey: "monsters/livingCorpse.png",
	},
	[MonsterClass.livingSpirit]: {
		name: "Living Spirit",
		//iconKey: "monsters/livingSpirit.png",
	},
	[MonsterClass.lurker]: {
		name: "Lurker",
		//iconKey: "monsters/lurker.png",
	},
	[MonsterClass.nightDemon]: {
		name: "Night Demon",
		//iconKey: "monsters/nightDemon.png",
	},
	[MonsterClass.ooze]: {
		name: "Ooze",
		//iconKey: "monsters/ooze.png",
	},
	[MonsterClass.rendingDrake]: {
		name: "Rending Drake",
		//iconKey: "monsters/rendingDrake.png",
	},
	[MonsterClass.savvasIcestorm]: {
		name: "Savvas Icestorm",
		//iconKey: "monsters/savvasIcestorm.png",
	},
	[MonsterClass.savvasLavaflow]: {
		name: "Savvas Lavaflow",
		//iconKey: "monsters/savvasLavaflow.png",
	},
	[MonsterClass.spittingDrake]: {
		name: "Spitting Drake",
		//iconKey: "monsters/spittingDrake.png",
	},
	[MonsterClass.stoneGolem]: {
		name: "Stone Golem",
		//iconKey: "monsters/stoneGolem.png",
	},
	[MonsterClass.sunDemon]: {
		name: "Sun Demon",
		//iconKey: "monsters/sunDemon.png",
	},
	[MonsterClass.vermlingScout]: {
		name: "Vermling Scout",
		//iconKey: "monsters/vermlingScout.png",
	},
	[MonsterClass.vermlingShaman]: {
		name: "Vermling Shaman",
		//iconKey: "monsters/vermlingShaman.png",
	},
	[MonsterClass.viciousDrake]: {
		name: "Vicious Drake",
		//iconKey: "monsters/viciousDrake.png",
	},
	[MonsterClass.windDemon]: {
		name: "Wind Demon",
		//iconKey: "monsters/windDemon.png",
	},
};
