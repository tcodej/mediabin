import { Fragment, useState, useEffect } from 'react';
import { apiURL } from '../utils/api';
import Carousel from './carousel';
import square from '../assets/img/transparent-square.png';
import discogsIcon from '../assets/img/icon-discogs.svg';
import bookIcon from '../assets/img/icon-book.svg';
import unknownIcon from '../assets/img/icon-unknown.svg';

export default function Cover({ item, onClick }) {
	const defaultData = {
		image: '',
		gallery: false,
		alt: 'Loading...',
		className: ''
	};

	const [ data, setData ] = useState({ ...defaultData });

	useEffect(() => {
		if (item) {
			const newData = {...defaultData};

			if (item.cover) {
				newData.image = `${apiURL}covers/${item.cover}`;

			} else {
				if (item.images) {
					// newData.image = item.images[0].uri;
					newData.gallery = {
						images: item.images
					};

				} else {
					newData.className = ' small';
					
					switch (item.source) {
						case 'discogs':
							newData.image = discogsIcon;
						break;

						case 'book':
							newData.image = bookIcon;
						break;

						default:
							newData.image = unknownIcon;
						break;
					}
				}
			}

			newData.alt = item.album ? item.album : 'Media Cover';
			setData(newData);
		}
	// eslint-disable-next-line
	}, [item]);

	const bgStyle = () => {
		// this fixes issues with perentheses in the url
		const css = "url('"+ data.image +"')";
		return { backgroundImage: css };
	};

	return (
		<Fragment>
				<div
					title={item.id}
					className={`cover${data.className}`}
					style={bgStyle()}
					onClick={() => { !data.gallery && onClick() }}
				>
					{
						data.gallery ? <Carousel gallery={data.gallery} />

						:

						<img src={square} alt={data.alt} draggable="false" />
					}
				</div>
		</Fragment>
	)
}
