import React, { FC } from "react";

interface IRoundActionsProps {
	onBeginNewRound(): void;
	onInitiativesComplete(): void;
}

export const RoundActions: FC<IRoundActionsProps> = props => {
	const { onBeginNewRound, onInitiativesComplete } = props;
	return (
		<div className="roundActionsOuter">
			<button className="roundActionsButton" onClick={onBeginNewRound}>
				Begin New Round
			</button>
			<button className="roundActionsButton" onClick={onInitiativesComplete}>
				Go!
			</button>
		</div>
	);
};
