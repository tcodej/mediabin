import { Fragment, useState, useEffect } from 'react';
import MediaItem from '../components/mediaItem';
import { updateReleaseCollection, updateWantlist } from '../utils/api';

export default function ReleaseModal({ item, collections, onClose, onDelete, onVerify }) {
	const [scrollY, setScrollY] = useState(0);
	const [wantlist, setWantlist] = useState('0');
	const [deleteMessage, setDeleteMessage] = useState();

	let timer;

	useEffect(() => {
		const root = document.getElementById('root');

		if (item) {
			setScrollY(window.scrollY);
			root.style.top = `-${window.scrollY}px`;
			root.classList.add('is-fixed');
			window.scrollTo(0, 0);
			setWantlist(item.wantlist);

		} else {
			root.classList.remove('is-fixed');
			window.scrollTo(0, scrollY);
		}
	// including scrollY below makes the page scroll to 0 which is unwanted
	}, [item]);

	const openInfoPage = () => {
		let url = `https://www.discogs.com/release/${item.id}`;

		if (item.source === 'book') {
			if (item.release_id) {
				url = `https://www.goodreads.com/book/show/${item.release_id}`;

			} else {
				return;
			}
		}

		window.open(url, '_mediainfo');
	}

	const saveItemCollection = (e) => {
		updateReleaseCollection(item.id, e.target.value);
	}

	const toggleWantlist = () => {
		const newVal = wantlist === '1' ? '0' : '1';
		setWantlist(newVal);
		updateWantlist(item.id, newVal);
	}

	const confirmDelete = () => {
		if (!deleteMessage) {
			setDeleteMessage('Sure?');

			timer = window.setTimeout(() =>{
				clearTimer();
			}, 5000);

			return;
		}

		clearTimer()
		onDelete();
	}

	const clearTimer = () => {
		window.clearTimeout(timer);
		setDeleteMessage();
	}

	const close = () => {
		clearTimer();
		onClose();
	}

	return (
		<Fragment>
		{item &&
			<Fragment>
				<div id="modal">
					<button type="button" className="btn-close" onClick={close}>X</button>
					<MediaItem
						item={item}
						onClick={openInfoPage}
						large
					/>

					<div id="release-bar">
						{ collections &&
							<select
								defaultValue={item.collection_id}
								onChange={saveItemCollection}
							>
								{collections.map(col => {
									return (
										<option key={col.id} value={col.id}>
											{col.label}
										</option>
									)
								})}
							</select>
						}

						<div id="toggle-wantlist" className={wantlist === '1' ? 'is-active' : ''} onClick={toggleWantlist}>
							{wantlist === '1' ? 'Remove from wantlist' : 'Add to wantlist'}
						</div>
					</div>

					{item.notes &&
						<p>{item.notes}</p>
					}

					{item.source === 'discogs' &&
						<div className="track-list">
							{ item.tracklist?.map((track, index) => {
								if (track.type_ === 'heading') {
									return <div key={`heading-${index}`} className="track heading">{track.title}</div>
								}

								return <div key={track.position+index} className="track">{track.position} {track.title}</div>
							})}
						</div>
					}
					<div className="buttons">
						<button type="button" className="btn-border" onClick={confirmDelete}>{deleteMessage || 'Delete'}</button>
						<button type="button" className="btn-border" onClick={onVerify}>Verify</button>
						<button type="button" className="btn-border" onClick={close}>Cancel</button>
					</div>
				</div>
				<div id="modal-overlay" onClick={close} />
			</Fragment>
		}
		</Fragment>
	);
}
