import { Fragment, useState } from 'react';
import { importDiscogsRelease } from '../utils/api';

export default function importModal({ onClose, onSuccess }) {
	const [ releaseID, setReleaseID ] = useState('');

	const importRelease = () => {
		if (releaseID) {
			importDiscogsRelease(releaseID).then(response => {
				onSuccess();
				onClose();
			});
		}
	}

	return (
		<Fragment>
			<div id="modal" className="import-modal">
				<button type="button" className="btn-close" onClick={onClose}>X</button>
				<p>Enter a Discogs release ID and click ok.</p>
				<input type="tel" maxLength="10" value={releaseID} onChange={(e) => setReleaseID(e.target.value) } />
				<button type="button" onClick={importRelease}>OK</button>
			</div>
			<div id="overlay" onClick={onClose} />
		</Fragment>
	);
}
