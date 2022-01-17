import React, { FC, useCallback, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { CharacterClass, characterClassInfos, ICharacter, isCharacter } from "../model/Character";
import { IMonster, MonsterClass, monsterClassInfos } from "../model/Monster";
import "../styles/Tracker.css";
import { ClassAdder } from "./ClassAdder";
import { RoundActions } from "./RoundActions";
import { TrackedClassRow } from "./TrackedClassRow";

interface ICookies {
	characters: ICharacterForCookie[];
}

interface ICharacterForCookie {
	name: string;
	characterClassId: CharacterClass;
}

interface ITrackerProps {}
export const Tracker: FC<ITrackerProps> = props => {
	const nextIdRef = useRef(0);
	const [cookies, setCookie] = useCookies<keyof ICookies, ICookies>(["characters"]);
	const [characters, setCharacters] = useState<ReadonlyMap<number, ICharacter>>(() => {
		const characters: ICharacter[] =
			cookies.characters?.map((c: ICharacterForCookie) => ({
				type: "character",
				id: nextIdRef.current++,
				name: c.name,
				characterClassId: c.characterClassId,
			})) ?? [];
		return new Map(characters.map(c => [c.id, c]));
	});

	const [orderedIds, setOrderedIds] = useState<number[]>(() => Array.from(characters.values()).map(c => c.id));

	const [monsters, setMonsters] = useState<ReadonlyMap<number, IMonster>>(new Map());
	const [showOptions, setshowOptions] = useState(false);

	const updateCookies = useCallback(
		(characters: ReadonlyMap<number, ICharacter>) => {
			setCookie(
				"characters",
				Array.from(characters.values()).map(c => ({
					name: c.name,
					characterClassId: c.characterClassId,
				}))
			);
		},
		[setCookie]
	);

	const onAddCharacter = useCallback(
		(name: string, characterClassId: CharacterClass) => {
			const newCharacter: ICharacter = {
				type: "character",
				id: nextIdRef.current++,
				name,
				characterClassId,
			};
			const newCharacters = new Map(characters).set(newCharacter.id, newCharacter);
			setCharacters(newCharacters);
			setOrderedIds([...orderedIds, newCharacter.id]);
			updateCookies(newCharacters);
		},
		[orderedIds, setOrderedIds, characters, updateCookies]
	);

	const onAddMonster = useCallback(
		(monsterClassId: MonsterClass) => {
			const newMonster: IMonster = {
				type: "monster",
				id: nextIdRef.current++,
				name: monsterClassInfos[monsterClassId].name,
				monsterClassId: monsterClassId,
			};
			setMonsters(new Map(monsters).set(newMonster.id, newMonster));
			setOrderedIds([...orderedIds, newMonster.id]);
		},
		[orderedIds, setOrderedIds, monsters]
	);

	const deleteTrackedClass = useCallback(
		(id: number) => {
			if (monsters.has(id)) {
				const newMonsters = new Map(monsters);
				newMonsters.delete(id);
				setMonsters(newMonsters);
			} else if (characters.has(id)) {
				const newCharacters = new Map(characters);
				newCharacters.delete(id);
				setCharacters(newCharacters);
				updateCookies(newCharacters);
			}
			setOrderedIds([...orderedIds.filter(orderedId => orderedId !== id)]);
		},
		[characters, monsters, orderedIds, setOrderedIds, updateCookies]
	);

	const setInitiative = useCallback(
		(id: number, value: number) => {
			const character = characters.get(id);
			if (character) {
				character.initiative = value;
			}
			const monster = monsters.get(id);
			if (monster) {
				monster.initiative = value;
			}
			setOrderedIds([...orderedIds]);
		},
		[characters, monsters, orderedIds, setOrderedIds]
	);

	const setTurnComplete = useCallback(
		(id: number, value: boolean) => {
			const character = characters.get(id);
			if (character) {
				character.turnComplete = value;
			}
			const monster = monsters.get(id);
			if (monster) {
				monster.turnComplete = value;
			}
			setOrderedIds([...orderedIds]);
		},
		[characters, monsters, orderedIds, setOrderedIds]
	);

	const onBeginNewRound = useCallback(() => {
		characters.forEach(c => {
			c.initiative = undefined;
			c.turnComplete = false;
		});
		monsters.forEach(m => {
			m.initiative = undefined;
			m.turnComplete = false;
		});
		setOrderedIds([...orderedIds]);
	}, [orderedIds, setOrderedIds, characters, monsters]);

	const onInitiativesComplete = useCallback(() => {
		setOrderedIds(
			[...Array.from(characters.values()), ...Array.from(monsters.values())]
				.sort((a, b) => (a.initiative ?? 0) - (b.initiative ?? 0))
				.map(tc => tc.id)
		);
	}, [characters, monsters, setOrderedIds]);

	const onMenuClick = useCallback(() => setshowOptions(!showOptions), [showOptions, setshowOptions]);
	const moveUp = useCallback(
		(id: number) => {
			const index = orderedIds.indexOf(id);
			setOrderedIds([...orderedIds.slice(0, index - 1), id, orderedIds[index - 1], ...orderedIds.slice(index + 1)]);
		},
		[orderedIds, setOrderedIds]
	);
	const moveDown = useCallback(
		(id: number) => {
			const index = orderedIds.indexOf(id);
			setOrderedIds([...orderedIds.slice(0, index), orderedIds[index + 1], id, ...orderedIds.slice(index + 2)]);
		},
		[orderedIds, setOrderedIds]
	);

	return (
		<div className="trackerOuter">
			<div className="menu">
				<span className="fa fa-ellipsis-v" onClick={onMenuClick} />
			</div>
			{orderedIds.length === 0 ? (
				"No characters added"
			) : (
				<div className="trackerClasses">
					{orderedIds.map((id, index) => {
						const prevTrackedClass =
							index > 0 ? characters.get(orderedIds[index - 1]) ?? monsters.get(orderedIds[index - 1]) : undefined;
						const nextTrackedClass =
							index < orderedIds.length
								? characters.get(orderedIds[index + 1]) ?? monsters.get(orderedIds[index + 1])
								: undefined;
						const trackedClass = characters.get(id) ?? monsters.get(id);
						if (!trackedClass) {
							throw new Error("Invalid character/monster state encountered");
						}
						const classInfo = isCharacter(trackedClass)
							? characterClassInfos[trackedClass.characterClassId]
							: monsterClassInfos[trackedClass.monsterClassId];
						return (
							<TrackedClassRow
								key={trackedClass.id}
								id={trackedClass.id}
								name={trackedClass.name}
								initiative={trackedClass.initiative}
								setInitiative={setInitiative}
								turnComplete={!!trackedClass.turnComplete}
								setTurnComplete={setTurnComplete}
								classInfo={classInfo}
								deleteTrackedClass={deleteTrackedClass}
								showOptions={showOptions}
								moveUp={
									trackedClass.initiative && prevTrackedClass?.initiative === trackedClass.initiative ? moveUp : undefined
								}
								moveDown={
									trackedClass.initiative && nextTrackedClass?.initiative === trackedClass.initiative
										? moveDown
										: undefined
								}
							/>
						);
					})}
				</div>
			)}
			<RoundActions onBeginNewRound={onBeginNewRound} onInitiativesComplete={onInitiativesComplete} />
			<ClassAdder characters={characters} monsters={monsters} onAddCharacter={onAddCharacter} onAddMonster={onAddMonster} />
		</div>
	);
};
