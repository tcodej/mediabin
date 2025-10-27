import { Fragment, useEffect, useState } from 'react';
import { importDiscogsRelease } from '../utils/api';

export default function ImportModal({ onClose, onSuccess }) {
	const [ releaseID, setReleaseID ] = useState('');

	useEffect(() => {
		document.getElementById('discogs-id').focus();
	}, []);

	const importRelease = (type) => {
		if (releaseID) {
			importDiscogsRelease(releaseID, type).then(resp => {
				onSuccess(resp.response);

				// later open a json preview modal
				if (type === 'preview') {
					console.log(resp.response);
				}

				onClose();
			});
		}
	}

	return (
		<Fragment>
			<div id="modal" className="import-modal">
				<button type="button" className="btn-close" onClick={onClose}>X</button>
				<p>Enter a Discogs release ID and click ok.</p>
				<input id="discogs-id" type="tel" maxLength="10" value={releaseID} onChange={(e) => setReleaseID(e.target.value)} />
				<div className="buttons">
					<button type="button" className="btn-border" onClick={() => importRelease('preview')}>Preview</button>
					<button type="button" className="btn-border" onClick={importRelease}>Import</button>
				</div>
			</div>
			<div id="overlay" onClick={onClose} />
		</Fragment>
	);
}
