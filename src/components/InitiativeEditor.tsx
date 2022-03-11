import React, { ChangeEvent, FC, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from "react";
import "../styles/InitiativeEditor.css";

interface IInitiativeEditorProps {
	initiative: number | undefined;
	setInitiative(newInitiative: number): void;
	focus: boolean;
}

export const InitiativeEditor: FC<IInitiativeEditorProps> = props => {
	const { initiative, setInitiative, focus } = props;
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [pendingInitiative, setPendingInitiative] = useState<number | undefined>(initiative);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setPendingInitiative(validateInitiative(event.target.value));
		},
		[setPendingInitiative]
	);

	const onAccept = useCallback(() => {
		if (pendingInitiative) {
			setInitiative(pendingInitiative);
		}
	}, [pendingInitiative, setInitiative]);

	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
		event => {
			switch (event.key) {
				case "Enter":
					onAccept();
					break;
			}
		},
		[onAccept]
	);

	const onBlur = useCallback(() => {
		onAccept();
	}, [onAccept]);

	useEffect(() => {
		if (focus) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [focus]);

	return (
		<input
			className="initInput"
			ref={inputRef}
			type="text"
			inputMode="numeric"
			pattern="[0-9]*"
			min={1}
			max={99}
			value={pendingInitiative ?? ""}
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={onBlur}
		/>
	);
};
function validateInitiative(valueStr: string | undefined): number | undefined {
	if (!valueStr) return undefined;
	const value = parseInt(valueStr);
	if (isNaN(value)) {
		return undefined;
	}
	if (value < 1) {
		return 1;
	}
	if (value > 99) {
		return 99;
	}
	if (!Number.isInteger(value)) {
		return Math.round(value);
	}
	return value;
}
