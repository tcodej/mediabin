import { useState } from 'react';
import { importDiscogsRelease } from '../utils/api';
import Cover from './cover';

export default function MediaItem({ item, onClick, large, onVerify }) {
	const [ imageSaved, setImageSaved ] = useState(false);
	const [ showContextMenu, setShowContextMenu ] = useState(false);

	const getArtist = () => {
		if (item.artists) {
			return item.artists[0].name;
		}

		return item.artist;
	}

	const getReleaseDate = () => {
		let date = '';

		if (item.released) {
			date = item.released;
		}

		if (item.year) {
			date = item.year;
		}

		return date == '0' ? '' : date;
	}

	const getFormat = () => {
		// option to return only the first item in the format list
		const parts = item.format.split(', ');

		if (large) {
			return item.format;
		}

		return parts[0];
	}

	const getImage = () => {
		if (item?.id) {
			importDiscogsRelease(item.id, 'image').then(resp => {
				if (resp.ok) {
					setImageSaved(true);
				}
			});
		}
	}

	const toggleContextMenu = (e) => {
		if (e.target.alt === 'Media Cover') {
			e.preventDefault();
			setShowContextMenu(!showContextMenu);
		}
	}

	const verifyMedia = () => {
		onVerify();
		item.date_verified = true;
		setShowContextMenu(false);
	}

	const getClassNames = () => {
		const classes = ['media'];

		if (large) {
			classes.push('large');
		}

		if (item.collection_id === 7) {
			classes.push('missing');
		}

		if (item.collection_id === 8) {
			classes.push('purge');
		}

		if (item.date_verified) {
			classes.push('verified');
		}

		return classes.join(' ');
	}

	return (
		<div className={getClassNames()} onContextMenu={toggleContextMenu}>
			<Cover item={item} onClick={onClick} />
			<div className="details">
				<div className="title">
					{item.title}
					{item.date_verified &&
						<div className="verified" title={`Verified ${item.date_verified}`}>Verified</div>
					}
					{item.dupes &&
						<span> ({item.dupes})</span>
					}
				</div>
				<div className="artist">{getArtist()}</div>
				<div className="year">{getReleaseDate()}</div>
				{item.series && (item.series.length > 0) &&
					<div>{item.series[0].catno}</div>
				}
				{item.format &&
					<div>{getFormat()}</div>
				}
				{large &&
					<div>
						<div>{item.source == 'book' ? 'GoodReads' : 'Discogs'} ID: {item.id}</div>
						<div onClick={onClick} className="link-info" title="More on Discogs.com">More Info</div>
						{imageSaved ?
							<div className="link-checked" title="Image saved">Saved</div>
						:
							<div onClick={getImage} className="link-import" title="Import Cover Image">Get Image</div>
						}
					</div>
				}
				{showContextMenu &&
					<div className="context-menu">
						<div onClick={verifyMedia}>Verify</div>
						<div onClick={() => setShowContextMenu(false)}>X</div>
					</div>
				}
			</div>
		</div>
	)
}
