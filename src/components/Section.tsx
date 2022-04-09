import React, { FC, useCallback, useState } from "react";
import "../styles/Section.css";
import { IconButton, IIconButtonProps } from "./Buttons";

export interface IHeaderIconProps extends IIconButtonProps {
	hidden?: boolean;
}

interface ISectionProps {
	title: string;
	collapsible?: boolean;
	headerIcons?: IHeaderIconProps[];
}

export const Section: FC<ISectionProps> = props => {
	const { title, children, collapsible, headerIcons } = props;
	const [expanded, setExpanded] = useState(true);

	const onToggleExpand = useCallback(() => setExpanded(!expanded), [expanded]);

	const allIcons = [
		...(headerIcons ?? []),
		{ iconKey: expanded ? "angles-up" : "angles-down", hidden: !collapsible, onClick: onToggleExpand },
	];

	return (
		<div className="sec">
			<div>
				<div className="title">{title}</div>
				{allIcons.length > 0 && (
					<div className="headerRightContainer">
						{allIcons
							.filter(i => !i.hidden)
							.map(({ iconKey, disabled, onClick }) => (
								<IconButton iconKey={iconKey} disabled={disabled} onClick={onClick} />
							))}
					</div>
				)}
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
