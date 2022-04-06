import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { CharacterClass, getCharacterClassName, getCharacterSummonables } from "../model/Character";
import { getMonsterName, MonsterClass } from "../model/Monster";
import { ItemSummonables } from "../model/Summon";
import { TrackerDispatch } from "../model/TrackerState";
import "../styles/FigureAdder.css";
import { getEnumValues, parseNumericEnum } from "../utils/EnumUtils";
import { IconButton } from "./Buttons";

export interface IExistingClasses {
	characters: ReadonlySet<CharacterClass>;
	monsters: ReadonlySet<MonsterClass>;
	allies: ReadonlySet<string>;
}

export interface IFigureAdderProps {
	existingFigures: IExistingClasses;
	dispatch: TrackerDispatch;
}

export const FigureAdder: FC<IFigureAdderProps> = props => {
	const { existingFigures, dispatch } = props;

	return (
		<div className="figureAdderOuter">
			<MonsterAdder existingMonsters={existingFigures.monsters} dispatch={dispatch} />
			<CharacterAdder existingCharacters={existingFigures.characters} dispatch={dispatch} />
			<SummonAdder existingCharacters={existingFigures.characters} dispatch={dispatch} />
			<AllyAdder existingAllies={existingFigures.allies} dispatch={dispatch} />
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
	const onAccept = useCallback(() => {
		if (monsterClass) {
			dispatch({ action: "addMonster", monsterClass });
			setMonsterClass(undefined);
		}
	}, [monsterClass, dispatch]);

	const onMonsterClassIdChange = useCallback((value: string | undefined) => {
		setMonsterClass(parseNumericEnum(MonsterClass, value));
	}, []);

	const monsterOptions = useMemo(
		(): IOption[] =>
			getEnumValues(MonsterClass)
				.filter(classId => !existingMonsters.has(classId))
				.map(classId => ({ value: classId, displayName: getMonsterName(classId) })),
		[existingMonsters]
	);

	return (
		<div>
			Monster
			<br />
			<AdderSelect displayName="Type" value={monsterClass} onChange={onMonsterClassIdChange} options={monsterOptions} />
			<IconButton disabled={!monsterClass} onClick={onAccept} iconKey="plus" />
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

	const onAccept = useCallback(() => {
		if (name && characterClass) {
			dispatch({ action: "addCharacter", name, characterClass });
			setName("");
			setCharacterClass(undefined);
		}
	}, [name, characterClass, dispatch]);

	const onCharacterClassChange = useCallback((value: string | undefined) => {
		setCharacterClass(parseNumericEnum(CharacterClass, value));
	}, []);

	const classOptions = useMemo(
		(): IOption[] =>
			getEnumValues(CharacterClass)
				.filter(classId => !existingCharacters.has(classId))
				.map(classId => ({ value: classId, displayName: getCharacterClassName(classId) })),
		[existingCharacters]
	);

	return (
		<div>
			Character
			<br />
			<AdderSelect displayName="Class" options={classOptions} value={characterClass} onChange={onCharacterClassChange} />
			<AdderName value={name} onChange={setName} />
			<IconButton disabled={!name || !characterClass} onClick={onAccept} iconKey="plus" />
		</div>
	);
};

interface ISummonAdderProps {
	existingCharacters: ReadonlySet<CharacterClass>;
	dispatch: TrackerDispatch;
}
const SummonAdder: FC<ISummonAdderProps> = props => {
	const { existingCharacters, dispatch } = props;
	const [characterClass, setCharacterClass] = useState<CharacterClass>();
	const [name, setName] = useState<string>();

	const onClassChange = useCallback((value: string | undefined) => {
		setCharacterClass(parseNumericEnum(CharacterClass, value));
	}, []);

	const onAccept = useCallback(() => {
		if (characterClass && name) {
			dispatch({ action: "addSummon", name, characterClass });
			setCharacterClass(undefined);
			setName(undefined);
		}
	}, [characterClass, name, dispatch]);

	const characterOptions = useMemo(
		(): IOption[] => Array.from(existingCharacters).map(classId => ({ value: classId, displayName: getCharacterClassName(classId) })),
		[existingCharacters]
	);
	const summonOptions = useMemo((): IOption[] => {
		const charSummonables = characterClass ? getCharacterSummonables(characterClass) : [];
		return [...charSummonables, ...ItemSummonables].map(value => ({ value }));
	}, [characterClass]);

	return (
		<div>
			Summon
			<br />
			<AdderSelect displayName="Character" value={characterClass} options={characterOptions} onChange={onClassChange} />
			<AdderSelect displayName="Summon" value={name} options={summonOptions} onChange={setName} disabled={!characterClass} />
			<IconButton disabled={!characterClass || !name} onClick={onAccept} iconKey="plus" />
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

	const onAccept = useCallback(() => {
		if (name) {
			dispatch({ action: "addAlly", name });
			setName("");
		}
	}, [name, dispatch]);

	return (
		<div>
			Ally
			<br />
			<AdderName value={name} onChange={setName} />
			<IconButton disabled={!name || existingAllies.has(name)} onClick={onAccept} iconKey="plus" />
		</div>
	);
};

interface IOption {
	value: string | number;
	displayName?: string;
}

interface IAdderSelectProps {
	displayName: string;
	value: string | number | undefined;
	onChange(value: string | undefined): void;
	options: IOption[];
	disabled?: boolean;
}
const AdderSelect: FC<IAdderSelectProps> = props => {
	const { displayName, value, onChange, options, disabled } = props;
	const onChangeWrapper: React.ChangeEventHandler<HTMLSelectElement> = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			const value = event.target.value;
			onChange(value === "default" ? undefined : value);
		},
		[onChange]
	);
	return (
		<select className="figureAdderInput figureAdderSelect" value={value ?? "default"} onChange={onChangeWrapper} disabled={disabled}>
			<option value="default">&lt;{displayName}&gt;</option>
			{options.map(({ value, displayName }) => (
				<option value={value} key={value}>
					{displayName ?? value}
				</option>
			))}
		</select>
	);
};

interface IAdderNameProps {
	value: string | undefined;
	onChange(value: string): void;
}
const AdderName: FC<IAdderNameProps> = props => {
	const { value, onChange } = props;
	const onChangeWrapper = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value), [onChange]);
	return <input className="figureAdderInput figureAdderNameField" value={value} onChange={onChangeWrapper} placeholder="Name" />;
};
