import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { CharacterClass, characterClassInfos, ICharacter } from "../model/Character";
import { IMonster, MonsterClass, monsterClassInfos } from "../model/Monster";
import { getEnumValues } from "../utils/EnumUtils";

export interface IClassAdderProps {
	characters: ReadonlyMap<number, ICharacter>;
	monsters: ReadonlyMap<number, IMonster>;
	onAddCharacter(name: string, classId: CharacterClass): void;
	onAddMonster(classId: MonsterClass): void;
}

export const ClassAdder: FC<IClassAdderProps> = props => {
	const { characters, monsters, onAddCharacter, onAddMonster } = props;
	const [name, setName] = useState("");
	const [characterClassId, setCharacterClassId] = useState<CharacterClass>();
	const [monsterClassId, setMonsterClassId] = useState<MonsterClass>();
	const [expanded, setExpanded] = useState(true);

	const existingCharacterClasses = useMemo(() => new Set(Array.from(characters.values()).map(c => c.characterClassId)), [characters]);
	const existingMonsterClasses = useMemo(() => new Set(Array.from(monsters.values()).map(m => m.monsterClassId)), [monsters]);

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value);
		},
		[setName]
	);

	const onCharacterAccept = useCallback(() => {
		if (name && typeof characterClassId !== "undefined") {
			onAddCharacter(name, characterClassId);
			setName("");
			setCharacterClassId(undefined);
		}
	}, [name, characterClassId, onAddCharacter]);

	const onMonsterAccept = useCallback(() => {
		if (typeof monsterClassId !== "undefined") {
			onAddMonster(monsterClassId);
			setMonsterClassId(undefined);
		}
	}, [monsterClassId, onAddMonster]);

	const onCharacterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setCharacterClassId(parsedInt in CharacterClass ? parsedInt : undefined);
		},
		[setCharacterClassId]
	);

	const onMonsterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setMonsterClassId(parsedInt in MonsterClass ? parsedInt : undefined);
		},
		[setMonsterClassId]
	);

	const onToggleExpand = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

	return (
		<div className="classAdderOuter">
			<div onClick={onToggleExpand}>
				<div className="classAdderHeader">Add monsters and characters</div>
				<div className={"classAdderHeaderExpand fa " + (expanded ? "fa-chevron-up" : "fa-chevron-down")} />
			</div>
			{expanded && (
				<div>
					Add a monster:
					<br />
					<select className="classAdderInput" value={monsterClassId ?? "default"} onChange={onMonsterClassIdChange}>
						<option value="default">&lt;Class&gt;</option>
						{getEnumValues(MonsterClass)
							.filter(classId => !existingMonsterClasses.has(classId))
							.map(classId => (
								<option value={classId} key={classId}>
									{monsterClassInfos[classId].name}
								</option>
							))}
					</select>
					<button disabled={typeof monsterClassId === "undefined"} onClick={onMonsterAccept}>
						<i className="fa fa-plus" />
					</button>
					<br />
					<br />
					Add a character:
					<br />
					<select className="classAdderInput" value={characterClassId ?? "default"} onChange={onCharacterClassIdChange}>
						<option value="default">&lt;Class&gt;</option>
						{getEnumValues(CharacterClass)
							.filter(classId => !existingCharacterClasses.has(classId))
							.map(classId => (
								<option value={classId} key={classId}>
									{characterClassInfos[classId].name}
								</option>
							))}
					</select>
					<input className="classAdderInput" value={name} onChange={onNameChange} placeholder="Name" />
					<button disabled={!name || typeof characterClassId === "undefined"} onClick={onCharacterAccept}>
						<i className="fa fa-plus" />
					</button>
				</div>
			)}
		</div>
	);
};
