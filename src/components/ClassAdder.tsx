import { ChangeEvent, FC, useCallback, useState } from "react";
import { CharacterClass, characterClassInfos } from "../model/Character";
import { MonsterClass, monsterClassInfos } from "../model/Monster";
import { ItemSummonables } from "../model/Summon";
import { TrackerDispatch } from "../model/TrackerState";
import "../styles/ClassAdder.css";
import { getEnumValues } from "../utils/EnumUtils";

export interface IExistingClasses {
	characters: ReadonlySet<CharacterClass>;
	monsters: ReadonlySet<MonsterClass>;
	allies: ReadonlySet<string>;
}

export interface IClassAdderProps {
	existingClasses: IExistingClasses;
	dispatch: TrackerDispatch;
}

export const ClassAdder: FC<IClassAdderProps> = props => {
	const { existingClasses, dispatch } = props;
	const [expanded, setExpanded] = useState(true);

	const onToggleExpand = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

	return (
		<div className="classAdderOuter">
			<div onClick={onToggleExpand}>
				<div className="classAdderHeader">Add monsters and characters</div>
				<div className={"classAdderHeaderExpand fa " + (expanded ? "fa-chevron-up" : "fa-chevron-down")} />
			</div>
			{expanded && (
				<div>
					<br />
					<MonsterAdder existingMonsters={existingClasses.monsters} dispatch={dispatch} />
					<br />
					<CharacterAdder existingCharacters={existingClasses.characters} dispatch={dispatch} />
					<br />
					<SummonAdder existingCharacters={existingClasses.characters} dispatch={dispatch} />
					<br />
					<AllyAdder existingAllies={existingClasses.allies} dispatch={dispatch} />
				</div>
			)}
		</div>
	);
};

interface IMonsterAdderProps {
	existingMonsters: ReadonlySet<MonsterClass>;
	dispatch: TrackerDispatch;
}

const MonsterAdder: FC<IMonsterAdderProps> = props => {
	const { existingMonsters, dispatch } = props;

	const [monsterClass, setMonsterClass] = useState<MonsterClass>();
	const onMonsterAccept = useCallback(() => {
		if (monsterClass) {
			dispatch({ action: "addMonster", monsterClass });
			setMonsterClass(undefined);
		}
	}, [monsterClass, setMonsterClass, dispatch]);

	const onMonsterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setMonsterClass(parsedInt in MonsterClass ? parsedInt : undefined);
		},
		[setMonsterClass]
	);

	return (
		<div>
			Add a monster:
			<br />
			<select className="classAdderInput" value={monsterClass ?? "default"} onChange={onMonsterClassIdChange}>
				<option value="default">&lt;Class&gt;</option>
				{getEnumValues(MonsterClass)
					.filter(classId => !existingMonsters.has(classId))
					.map(classId => (
						<option value={classId} key={classId}>
							{monsterClassInfos[classId].name}
						</option>
					))}
			</select>
			<button disabled={!monsterClass} onClick={onMonsterAccept}>
				<i className="fa fa-plus" />
			</button>
		</div>
	);
};

interface ICharacterAdderProps {
	existingCharacters: ReadonlySet<CharacterClass>;
	dispatch: TrackerDispatch;
}

const CharacterAdder: FC<ICharacterAdderProps> = props => {
	const { existingCharacters, dispatch } = props;

	const [name, setName] = useState("");
	const [characterClass, setCharacterClass] = useState<CharacterClass>();

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

	const onCharacterClassIdChange = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const parsedInt = parseInt(event.target.value, 10);
			setCharacterClass(parsedInt in CharacterClass ? parsedInt : undefined);
		},
		[setCharacterClass]
	);

	return (
		<div>
			Add a character:
			<br />
			<select className="classAdderInput" value={characterClass ?? "default"} onChange={onCharacterClassIdChange}>
				<option value="default">&lt;Class&gt;</option>
				{getEnumValues(CharacterClass)
					.filter(classId => !existingCharacters.has(classId))
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
		</div>
	);
};

interface ISummonAdderProps {
	existingCharacters: ReadonlySet<CharacterClass>;
	dispatch: TrackerDispatch;
}
const SummonAdder: FC<ISummonAdderProps> = props => {
	const { existingCharacters: existingCharacterClasses, dispatch } = props;
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
			dispatch({ action: "addSummon", name: selectedSummon, characterClass: selectedClass });
			setSelectedClass(undefined);
			setSelectedSummon(undefined);
		}
	}, [selectedClass, selectedSummon, setSelectedClass, setSelectedSummon, dispatch]);

	const summonableAllies: string[] = [];
	if (selectedClass) {
		summonableAllies.push(...(characterClassInfos[selectedClass].summonableAllies || []));
		summonableAllies.push(...ItemSummonables);
	}

	return (
		<div>
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
		</div>
	);
};

interface IAllyAdderProps {
	existingAllies: ReadonlySet<string>;
	dispatch: TrackerDispatch;
}

const AllyAdder: FC<IAllyAdderProps> = props => {
	const { existingAllies, dispatch } = props;

	const [name, setName] = useState("");

	const onNameChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setName(event.target.value);
		},
		[setName]
	);

	const onAccept = useCallback(() => {
		if (name) {
			dispatch({ action: "addAlly", name });
			setName("");
		}
	}, [name, setName, dispatch]);

	return (
		<div>
			Add an ally:
			<br />
			<input className="classAdderInput classAdderNameField" value={name} onChange={onNameChange} placeholder="Name" />
			<button disabled={!name || existingAllies.has(name)} onClick={onAccept}>
				<i className="fa fa-plus" />
			</button>
		</div>
	);
};
