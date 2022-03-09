import React, { FC, useCallback } from "react";
import { TrackerDispatch } from "../model/TrackerState";

interface IRoundActionsProps {
	dispatch: TrackerDispatch;
}

export const RoundActions: FC<IRoundActionsProps> = props => {
	const { dispatch } = props;

	const resetForNewRound = useCallback(() => {
		dispatch({ action: "resetForNewRound" });
	}, [dispatch]);
	const beginRound = useCallback(() => {
		dispatch({ action: "beginRound" });
	}, [dispatch]);

	return (
		<div className="roundActionsOuter">
			<button className="roundActionsButton" onClick={resetForNewRound}>
				New Round
			</button>
			<button className="roundActionsButton" onClick={beginRound}>
				Begin Round
			</button>
		</div>
	);
};
