import { ChangeEvent, FC, useCallback, useState } from "react";
import { CharacterClass, characterClassInfos } from "../model/Character";
import { MonsterClass, monsterClassInfos } from "../model/Monster";
import { TrackerAction } from "../model/TrackerState";
import { getEnumValues } from "../utils/EnumUtils";

export interface IExistingClasses {
	characters: Set<CharacterClass>;
	monsters: Set<MonsterClass>;
}

export interface IClassAdderProps {
	existingClasses: IExistingClasses;
	dispatch: React.Dispatch<TrackerAction>;
}

export const ClassAdder: FC<IClassAdderProps> = props => {
	const { existingClasses, dispatch } = props;
	const [name, setName] = useState("");
	const [characterClass, setCharacterClass] = useState<CharacterClass>();
	const [monsterClass, setMonsterClass] = useState<MonsterClass>();
	const [expanded, setExpanded] = useState(true);

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value);
		},
		[setName]
	);

	const onCharacterAccept = useCallback(() => {
		if (name && typeof characterClass !== "undefined") {
			dispatch({ action: "addCharacter", name, characterClass });
			setName("");
			setCharacterClass(undefined);
		}
	}, [name, setName, characterClass, setCharacterClass, dispatch]);

	const onMonsterAccept = useCallback(() => {
		if (typeof monsterClass !== "undefined") {
			dispatch({ action: "addMonster", monsterClass });
			setMonsterClass(undefined);
		}
	}, [monsterClass, setMonsterClass, dispatch]);

	const onCharacterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setCharacterClass(parsedInt in CharacterClass ? parsedInt : undefined);
		},
		[setCharacterClass]
	);

	const onMonsterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setMonsterClass(parsedInt in MonsterClass ? parsedInt : undefined);
		},
		[setMonsterClass]
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
					<select className="classAdderInput" value={monsterClass ?? "default"} onChange={onMonsterClassIdChange}>
						<option value="default">&lt;Class&gt;</option>
						{getEnumValues(MonsterClass)
							.filter(classId => !existingClasses.monsters.has(classId))
							.map(classId => (
								<option value={classId} key={classId}>
									{monsterClassInfos[classId].name}
								</option>
							))}
					</select>
					<button disabled={typeof monsterClass === "undefined"} onClick={onMonsterAccept}>
						<i className="fa fa-plus" />
					</button>
					<br />
					<br />
					Add a character:
					<br />
					<select className="classAdderInput" value={characterClass ?? "default"} onChange={onCharacterClassIdChange}>
						<option value="default">&lt;Class&gt;</option>
						{getEnumValues(CharacterClass)
							.filter(classId => !existingClasses.characters.has(classId))
							.map(classId => (
								<option value={classId} key={classId}>
									{characterClassInfos[classId].name}
								</option>
							))}
					</select>
					<input className="classAdderInput classAdderNameField" value={name} onChange={onNameChange} placeholder="Name" />
					<button disabled={!name || typeof characterClass === "undefined"} onClick={onCharacterAccept}>
						<i className="fa fa-plus" />
					</button>
				</div>
			)}
		</div>
	);
};
