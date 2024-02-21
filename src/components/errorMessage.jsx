import { Fragment, useEffect } from 'react';
import { useAppContext } from '../contexts/application';

export default function ErrorMessage() {
	const { appState, updateAppState } = useAppContext();

	const closeMessage = () => {
		updateAppState({ error: false });
	}

	useEffect(() => {
		updateAppState({ menuOpen: false });
	// eslint-disable-next-line
	}, [appState.error]);

	return (
		<Fragment>
			{ appState.error &&
				<div id="error-message">
					<p>{appState.error}</p>
					<div className="button" onClick={closeMessage}>Close</div>
				</div>
			}
		</Fragment>
	)
}
