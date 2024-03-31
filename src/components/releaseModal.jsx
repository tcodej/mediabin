import { Fragment, useState, useEffect } from 'react';
import MediaItem from '../components/mediaItem';
import { updateReleaseCollection } from '../utils/api';

export default function ReleaseModal({ item, collections, onClose }) {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const root = document.getElementById('root');

		if (item) {
			setScrollY(window.scrollY);
			root.style.top = `-${window.scrollY}px`;
			root.classList.add('is-fixed');
			window.scrollTo(0, 0);

		} else {
			root.classList.remove('is-fixed');
			window.scrollTo(0, scrollY);
		}
	// including scrollY below makes the page scroll to 0 which is unwanted
	// eslint-disable-next-line react-hooks/exhaustive-deps
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

	return (
		<Fragment>
		{ item &&
			<Fragment>
				<div id="modal">
					<button type="button" className="btn-close" onClick={onClose}>X</button>
					<MediaItem
						item={item}
						onClick={openInfoPage}
						large
					/>

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

					{ (item.notes) &&
						<p>{item.notes}</p>
					}

					{ item.source === 'discogs' &&
						<div className="track-list">
							{ item.tracklist.map((track, index) => {
								if (track.type_ === 'heading') {
									return <div key={`heading-${index}`} className="track heading">{track.title}</div>
								}

								return <div key={track.position+index} className="track">{track.position} {track.title}</div>
							})}
						</div>
					}

				</div>
				<div id="modal-overlay" onClick={onClose} />
			</Fragment>
		}
		</Fragment>
	);
}
