import { ChangeEvent, FC, useCallback, useState } from "react";
import { CharacterClass, characterClassInfos } from "../model/Character";
import { MonsterClass, monsterClassInfos } from "../model/Monster";
import { ItemSummonables } from "../model/Summon";
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
		if (name && characterClass) {
			dispatch({ action: "addCharacter", name, characterClass });
			setName("");
			setCharacterClass(undefined);
		}
	}, [name, setName, characterClass, setCharacterClass, dispatch]);

	const onMonsterAccept = useCallback(() => {
		if (monsterClass) {
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
					<button disabled={!monsterClass} onClick={onMonsterAccept}>
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
					<button disabled={!name || !characterClass} onClick={onCharacterAccept}>
						<i className="fa fa-plus" />
					</button>
					<br />
					<br />
					<SummonAdder existingCharacterClasses={existingClasses.characters} dispatch={dispatch} />
				</div>
			)}
		</div>
	);
};

interface ISummonAdderProps {
	existingCharacterClasses: Set<CharacterClass>;
	dispatch: React.Dispatch<TrackerAction>;
}
const SummonAdder: FC<ISummonAdderProps> = props => {
	const { existingCharacterClasses, dispatch } = props;
	const [selectedClass, setSelectedClass] = useState<CharacterClass>();
	const [selectedSummon, setSelectedSummon] = useState<string>();

	const onClassChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setSelectedClass(parsedInt in CharacterClass ? parsedInt : undefined);
		},
		[setSelectedClass]
	);
	const onSummonChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const summon = event.target.value;
			setSelectedSummon(summon === "default" ? undefined : summon);
		},
		[setSelectedSummon]
	);

	const onAccept = useCallback(() => {
		if (selectedClass && selectedSummon) {
			dispatch({ action: "addSummon", name: selectedSummon, characterClass: selectedClass }); //TODO
			setSelectedClass(undefined);
			setSelectedSummon(undefined);
		}
	}, [selectedClass, selectedSummon, setSelectedClass, setSelectedSummon]);

	//TODO: feed this the actual character names

	const summonableAllies: string[] = [];
	if (selectedClass) {
		summonableAllies.push(...(characterClassInfos[selectedClass].summonableAllies || []));
		summonableAllies.push(...ItemSummonables);
	}

	return (
		<>
			Add a summon:
			<br />
			<select className="classAdderInput" value={selectedClass ?? "default"} onChange={onClassChange}>
				<option value="default">&lt;Character&gt;</option>
				{Array.from(existingCharacterClasses).map(classId => (
					<option value={classId} key={classId}>
						{characterClassInfos[classId].name}
					</option>
				))}
			</select>
			<select className="classAdderInput" value={selectedSummon ?? "default"} onChange={onSummonChange} disabled={!selectedClass}>
				<option value="default">&lt;Summon&gt;</option>
				{summonableAllies.map(name => (
					<option value={name} key={name}>
						{name}
					</option>
				))}
			</select>
			<button disabled={!selectedClass || !selectedSummon} onClick={onAccept}>
				<i className="fa fa-plus" />
			</button>
		</>
	);
};
