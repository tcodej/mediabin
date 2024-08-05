import { useState } from 'react';
import { importDiscogsRelease } from '../utils/api';
import Cover from './cover';

export default function MediaItem({ item, onClick, large }) {
	const [ imageSaved, setImageSaved ] = useState(false);

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
			importDiscogsRelease(item.id, true).then(resp => {
				console.log(resp);
				if (resp.ok) {
					setImageSaved(true);
				}
			});
		}
	}

	return (
		<div className={'media'+ (large ? ' large' : '')}>
			<Cover item={item} onClick={onClick} />
			<div className="details">
				<div className="title">
					{item.title}
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
						<div>Discogs ID: {item.id}</div>
						<div onClick={onClick} className="link-info" title="More on Discogs.com">More Info</div>
						{imageSaved ?
							<div className="link-checked" title="Image saved">Saved</div>
						:
							<div onClick={getImage} className="link-import" title="Import Cover Image">Get Image</div>
						}
					</div>
				}
			</div>
		</div>
	)
}
