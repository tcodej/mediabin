import { useState, useEffect } from 'react';
import { apiURL } from '../utils/api';
import square from '../assets/img/transparent-square.png';
import discogsIcon from '../assets/img/icon-discogs.svg';
import bookIcon from '../assets/img/icon-book.svg';
import unknownIcon from '../assets/img/icon-unknown.svg';

export default function Cover({ item, onClick }) {
	const [ data, setData ] = useState({
		image: '',
		slideshow: false,
		alt: 'Loading...',
		className: ' small'
	});

	useEffect(() => {
		let image = '';
		let className = '';
		let slides = false;

		if (item) {
			if (item.cover) {
				image = `${apiURL}covers/${item.cover}`;

			} else {
				if (item.images) {
					image = item.images[0].uri;
					slides = item.images;

				} else {
					className = ' small';
					
					switch (item.source) {
						case 'discogs':
							image = discogsIcon;
						break;

						case 'book':
							image = bookIcon;
						break;

						default:
							image = unknownIcon;
						break;
					}
				}
			}

			const alt = item.album ? item.album : 'Media Cover';

			setData({
				image: image,
				slideshow: slides,
				alt: alt,
				className: className
			});
		}
	}, [item]);

	const bgStyle = () => {
		// this fixes issues with perentheses in the url
		const css = "url('"+ data.image +"')";
		return { backgroundImage: css };
	};

	return (
		<div
			className={`cover${data.className}`}
			style={bgStyle()}
			onClick={onClick}
		>
			{
				data.slideshow ? data.slideshow.map((slide, i) => {
					return <img key={i} src={slide.uri} alt="slide" />
				})

				:

				<img src={square} alt={data.alt} draggable="false" />
			}
		</div>
	)
}
