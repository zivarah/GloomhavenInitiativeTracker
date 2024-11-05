import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { getEnumValues, parseNumericEnum } from "../common/EnumUtils";
import { CharacterClass, getCharacterClassName, getCharacterSpoilerAlias } from "../model/Character";
import { getMonsterName, MonsterClass } from "../model/Monster";
import { getCharacterSummonables, getSummonName, SummonClass } from "../model/Summon";
import { TrackerDispatch } from "../model/TrackerState";
import "../styles/FigureAdder.css";
import { IconButton } from "./Buttons";

export interface IExistingClasses {
	characters: ReadonlySet<CharacterClass>;
	summons: ReadonlyMap<CharacterClass, ReadonlySet<SummonClass>>;
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
			<SummonAdder existingCharacters={existingFigures.characters} existingSummons={existingFigures.summons} dispatch={dispatch} />
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
			sortOptions(
				getEnumValues(MonsterClass)
					.filter(classId => !existingMonsters.has(classId))
					.map(classId => ({ value: classId, displayName: getMonsterName(classId) }))
			),
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
			sortOptions(
				getEnumValues(CharacterClass)
					.filter(classId => !existingCharacters.has(classId))
					.map(classId => ({ value: classId, displayName: getCharacterSpoilerAlias(classId) ?? getCharacterClassName(classId) }))
			),
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
	existingSummons: ReadonlyMap<CharacterClass, ReadonlySet<SummonClass>>;
	dispatch: TrackerDispatch;
}
const SummonAdder: FC<ISummonAdderProps> = props => {
	const { existingCharacters, existingSummons, dispatch } = props;
	const [characterClass, setCharacterClass] = useState<CharacterClass>();
	const [summonClass, setSummonClass] = useState<SummonClass>();
	const [summonName, setSummonName] = useState<string | undefined>();

	const onCharacterChange = useCallback((value: string | undefined) => {
		setCharacterClass(parseNumericEnum(CharacterClass, value));
	}, []);
	const onSummonChange = useCallback((value: string | undefined) => {
		setSummonClass(parseNumericEnum(SummonClass, value));
	}, []);
	const onSummonNameChange = useCallback((value: string | undefined) => {
		setSummonName(value);
	}, []);

	const onAccept = useCallback(() => {
		if (characterClass && summonClass) {
			dispatch({ action: "addSummon", summonClass, characterClass, summonName });
			setCharacterClass(undefined);
			setSummonClass(undefined);
			setSummonName("");
		}
	}, [characterClass, summonClass, summonName, dispatch]);

	const characterOptions = useMemo(
		(): IOption[] =>
			sortOptions(
				Array.from(existingCharacters).map(classId => ({
					value: classId,
					displayName: getCharacterClassName(classId),
				}))
			),
		[existingCharacters]
	);
	const summonOptions = useMemo((): IOption[] => {
		if (!characterClass) {
			return [];
		}
		const charSummonables = getCharacterSummonables(characterClass);
		return sortOptions(
			charSummonables
				.filter(summonClass => !existingSummons.get(characterClass)?.has(summonClass))
				.map(summonClass => ({
					value: summonClass,
					displayName: getSummonName(summonClass),
				}))
		);
	}, [characterClass, existingSummons]);

	return (
		<div>
			Summon
			<br />
			<AdderSelect displayName="Character" value={characterClass} options={characterOptions} onChange={onCharacterChange} />
			<AdderSelect
				displayName="Summon"
				value={summonClass}
				options={summonOptions}
				onChange={onSummonChange}
				disabled={!characterClass}
			/>
			<IconButton disabled={!characterClass || !summonClass} onClick={onAccept} iconKey="plus" />
			{summonClass && (
				<>
					<br />
					<div className="rowSpacer" />
					<AdderName value={summonName} onChange={onSummonNameChange} />
				</>
			)}
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
	displayName: string;
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

function sortOptions(options: IOption[]): IOption[] {
	return options.sort((a, b) => a.displayName.localeCompare(b.displayName));
}
