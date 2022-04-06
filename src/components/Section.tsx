import React, { FC, useCallback, useState } from "react";
import "../styles/Section.css";

interface ISectionProps {
	title: string;
	collapsible?: boolean;
	headerIcons?: IHeaderIconProps[];
}

export const Section: FC<ISectionProps> = props => {
	const { title, children, collapsible, headerIcons } = props;
	const [expanded, setExpanded] = useState(true);

	const onToggleExpand = useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);

	const allIcons = [
		...(headerIcons ?? []),
		{ iconKey: expanded ? "angles-up" : "angles-down", hidden: !collapsible, onClick: onToggleExpand },
	];

	return (
		<div className="sec">
			<div>
				<div className="title">{title}</div>
				{allIcons.length > 0 && <div className="headerRightContainer">{allIcons.map(HeaderIcon)}</div>}
			</div>
			{expanded && (
				<>
					<hr />
					{children}
				</>
			)}
		</div>
	);
};

interface IHeaderIconProps {
	iconKey: string;
	hidden?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}
const HeaderIcon: FC<IHeaderIconProps> = props => {
	const { iconKey, hidden, disabled, onClick } = props;
	if (hidden) {
		return null;
	}
	const classNames = ["fa", "fa-" + iconKey];
	if (disabled) {
		classNames.push("disabled");
	}
	return (
		<div onClick={disabled ? undefined : onClick}>
			<span className={classNames.join(" ")} />
		</div>
	);
};
