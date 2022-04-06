import React, { FC } from "react";
import "../styles/Buttons.css";

interface IButtonBaseProps {
	onClick: () => void;
	disabled?: boolean;
}

export interface IButtonProps extends IButtonBaseProps {
	caption: string;
	iconKey?: string;
}

export const Button: FC<IButtonProps> = props => {
	const { caption, onClick, iconKey, disabled } = props;
	const iconClassNames: string[] = [];
	iconKey && iconClassNames.push("fa", "fa-" + iconKey);
	disabled && iconClassNames.push("disabled");
	return (
		<button className={"btn captioned"} onClick={disabled ? undefined : onClick} disabled={disabled}>
			{iconKey && <i className={iconClassNames.join(" ")} />}
			{caption}
		</button>
	);
};

export interface IIconButtonProps extends IButtonBaseProps {
	iconKey: string;
	compact?: boolean;
}
export const IconButton: FC<IIconButtonProps> = props => {
	const { onClick, iconKey, disabled, compact } = props;
	const buttonClassNames = ["btn", "iconOnly"];
	compact && buttonClassNames.push("compact");
	const iconClassNames = ["fa", "fa-" + iconKey];
	disabled && iconClassNames.push("disabled");
	compact && iconClassNames.push("fa-sm");
	return (
		<span className={buttonClassNames.join(" ")} onClick={disabled ? undefined : onClick}>
			<span className={iconClassNames?.join(" ")} />
		</span>
	);
};
