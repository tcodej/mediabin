import Cover from './cover';

export default function MediaItem({ item, onClick, large }) {
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
				{
					large && <div onClick={onClick} className="link-info">More Info</div>
				}
			</div>
		</div>
	)
}
