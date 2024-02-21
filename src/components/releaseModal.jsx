import { Fragment } from 'react';
import MediaItem from '../components/mediaItem';

export default function ReleaseModal({ item, onClose }) {
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
				<div id="overlay" onClick={onClose} />
			</Fragment>
		}
		</Fragment>
	);
}
