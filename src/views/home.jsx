import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/application';
import * as api from '../utils/api';
import { shuffle, delay } from '../utils';
import ErrorMessage from '../components/errorMessage';
import Loading from '../components/loading';
import Success from '../components/success';
import MediaItem from '../components/mediaItem';
import ReleaseModal from '../components/releaseModal';
import ImportModal from '../components/importModal';
import FilterToggle from '../components/filterToggle';
import CollectionToggle from '../components/collectionToggle';

export default function Home() {
	const params = useParams();
	const queryField = useRef(null);
	const timer = useRef(null);
	const { appState, updateAppState, appAction } = useAppContext();
	const [ loaded, setLoaded ] = useState(false);
	const [ successOpen, setSuccessOpen ] = useState(false);
	const [ media, setMedia ] = useState();
	const [ list, setList ] = useState();
	const [ currentMedia, setCurrentMedia ] = useState();
	const [ query, setQuery ] = useState('');
	const [ filters, setFilters ] = useState([]);
	const [ resultCount, setResultCount ] = useState('');
	const [ importOpen, setImportOpen ] = useState(false);
	const [ collections, setCollections ] = useState([]);

	const formats = [
		{ value: 'LP', label: 'LP' },
		{ value: 'CD', label: 'CD' },
		{ value: 'EP', label: 'EP' },
		{ value: '7"', label: '7"' },
		{ value: '10"', label: '10"' },
		{ value: '12"', label: '12"' },
		{ value: 'Cass', label: 'Cassette' },
		{ value: '8-Trk', label: '8 Track' },
		{ value: 'DVD', label: 'DVD' },
		{ value: 'VHS', label: 'VHS' },
		{ value: 'CDr', label: 'CDR' }
	];

	const types = [
		{ value: 'Autograph', label: 'Autographed' },
		{ value: 'Unofficial', label: 'Bootleg' },
		{ value: 'Box', label: 'Box' },
		{ value: 'Color', label: 'Colored Vinyl' },
		{ value: 'Enh', label: 'Enhanced' },
		{ value: 'File', label: 'Digital' },
		{ value: 'Gat', label: 'Gatefold' },
		{ value: 'Mono', label: 'Mono' },
		{ value: 'Pic', label: 'Picture Disc' },
		{ value: 'Promo', label: 'Promo' },
		{ value: 'Single', label: 'Single' },
		{ value: 'Ltd', label: 'Limited Edition' },
		{ value: 'Num', label: 'Numbered' },
		{ value: 'Book', label: 'Book' },
		{ value: 'Hardcover', label: 'Hardcover' },
		{ value: 'Paperback', label: 'Paperback' }
	];

	const queryParam = params['*'];

	useEffect(() => {
		if (media && queryParam) {
			queryField.current.value = queryParam;
			updateAppState({ menuOpen: true });
			runQuery();
		}
	}, [media]);

	useEffect(() => {
		if (!media) {
			api.getMedia().then(response => {
				if (response && response.ok) {
					setLoaded(true);
					setMedia(response.result);

					if (!queryParam) {
						sideToggle(true);
						// setList(response.result);
						// setResultCount(response.result.length +' total');
					}

					api.getCollections().then(respCol => {
						// add a hard-coded 'everything' collection
						setCollections([ { id: 0, name: 'All Media' }, ...respCol.result]);
					});
/*					
					// use this async loop to populate data from each discogs api release call
					(async () => {
						let count = 0;
						for await (const item of response.result) {
							count++;

							if (!item.cover) {
								api.getDiscogsRelease(item.release_id).then(response => {
									console.log(`item ${count}: ${item.release_id}`);
									item.cover = item.release_id +'.jpg';
								});
								await delay(1000);

							} else {
								console.log(`item ${count}: skipping`);
							}
						}

						setLoaded(true);
						setMedia(response.result);
					})();
*/
				} else {
					setLoaded(true);
					updateAppState({ error: 'Sorry, there has been an error. Failed to load media.'});
				}
			});
		}
	}, [media]);

	useEffect(() => {
		if (appState.menuOpen) {
			queryField.current.focus();

		} else {
			queryField.current.blur();
		}
	}, [appState.menuOpen]);

	const sideToggle = (bool) => {
		appAction.toggleMenu(bool);
	}

	const openRelease = (media) => {
		if (media.source === 'discogs') {
			api.getDiscogsRelease(media.release_id).then(response => {
				// tack on any relevant info from the media object
				response.notes = media.notes;
				response.source = media.source;
				response.released = media.released;
				response.format = media.format;

				setCurrentMedia(response);
			});
		}

		if (media.source === 'book') {
			// book/goodreads
			setCurrentMedia(media);
		}
	}

	const closeRelease = () => {
		setCurrentMedia(false);
	}

	const openImport = () => {
		setImportOpen(true);
	}

	const closeImport = () => {
		setImportOpen(false);
	}

	const randomMedia = () => {
		const total = 20;
		const random = shuffle([...media]).splice(0, total);
		clearQuery();
		setList(random);
		setResultCount(`${total} random items`);
		triggerSuccess();
	}

	const clearCache = () => {
		api.clearCache()
			.then(response => {
				// trigger a media reload
				setMedia();
				runQuery();
				triggerSuccess()
			});
	}

	const runQuery = () => {
		window.clearTimeout(timer.current);
		let q = queryField.current.value.trimStart();
		let qText = q.trim();
		let match = false;

		setQuery(q);

		timer.current = window.setTimeout(() => {
			window.clearTimeout(timer.current);

			q = q.trim().toLowerCase().split(' ');

			if (q[0].length < 3) {
				setList(media);
				setResultCount('');

				if (filters.length < 1) {
					return;
				}
			}

			let results = media.filter(item => {
				let match = 0;

				if (queryParam === 'noyear') {
					if (!item.released || item.released == '0') {
						return item;
					}

				} else {
					q.forEach(word => {
						if (item.artist.toLowerCase().indexOf(word) > -1 || item.title.toLowerCase().indexOf(word) > -1) {
							match++;
						}
					});

					if (match === q.length) {
						return item;
					}
				}
			});

			if (filters.length > 0) {
				results = results.filter(item => {
					match = false;

					for (var i=0; i<filters.length; i++) {
						if (item.format.toLowerCase().includes(filters[i].toLowerCase())) {
							match = true;
							break;
						}
					}

					if (match) {
						return item;
					}
				});
			}

			let resultText = '';

			if (results.length) {
				resultText = `${results.length} matches`;

			} else {
				resultText = 'No matches';
			}

			if (qText) {
				resultText += ` for '${qText}'`;
			}

			if (filters.length) {
				resultText += ` with filters ${filters.join(' or ')}`;
			}

			setResultCount(resultText);
			setList(results);
		}, 500);
	}

	const clearQuery = (reset) => {
		setQuery('');
		setFilters([]);
		setResultCount('');

		if (reset === true) {
			queryField.current.focus();
			setList(media);
		}
	}

	const toggleFilter = (filter) => {
		let list = filters;
		const index = list.indexOf(filter.value);

		if (index > -1) {
			list.splice(index, 1);

		} else {
			list.push(filter.value);
		}

		setFilters(list);
		runQuery();
	}

	const loadCollection = (col) => {
		clearQuery();
		let results;

		if (col.id === 0) {
			// show all
			results = media;

		} else {
			results = media.filter(item => {
				if (item.collection_id === col.id) {
					return item;
				}
			});
		}

		setList(results);
		setResultCount(results.length +' items in '+ col.name);
/*
		// alternate back-end query
		api.getCollection(col.id).then(response => {
			setList(response.result);
			setResultCount(response.result.length +' items in '+ col.name);
		});
*/
	}

	const triggerSuccess = async () => {
		setSuccessOpen(true);
		await delay(1000);
		setSuccessOpen(false);
	}

	return (
		<div id="page-home">
			<div id="side-panel" className={appState.menuOpen ? 'is-open' : ''}>
				<div id="media-filter">
					<input
						type="text"
						id="field-query"
						ref={queryField}
						value={query}
						maxLength="30"
						onChange={runQuery}
						placeholder="Find in Media"
					/>
					<button type="button" className="btn-clear" onClick={() => clearQuery(true)}>Clear</button>
				</div>
				<div id="filter-list">
					<div className="heading">Collections</div>
					{ collections.map(col => {
						return (
							<CollectionToggle
								key={col.id}
								collection={col}
								onClick={() => loadCollection(col)}
							/>
						)
					})}

					<div className="heading">Media Formats</div>
					{ formats.map(format => {
						return (
							<FilterToggle
								key={format.value}
								filter={format}
								isActive={filters.includes(format.value)}
								onClick={() => toggleFilter(format)}
							/>
						)
					})}

					<div className="heading">Media Types</div>
					{ types.map(type => {
						return (
							<FilterToggle
								key={type.value}
								filter={type}
								isActive={filters.includes(type.value)}
								onClick={() => toggleFilter(type)}
							/>
						)
					})}
				</div>
				<div id="buttons">
					<button type="button" title="Import Discogs Release" className="btn-import" onClick={openImport}>Import Discogs Release</button>
					<button type="button" title="Random Media" className="btn-random-media" onClick={randomMedia}>Random Media</button>
					<button type="button" title="Clear the Cache" className="btn-clear-cache" onClick={clearCache}>Clear the Cache</button>
				</div>
			</div>

			<div id="main-panel" className={appState.menuOpen ? 'is-open' : ''}>
				{ !loaded &&
					<Loading />
				}

				{ resultCount &&
					<div id="result-count">
						{resultCount}
					</div>
				}

				{ (loaded && !list) &&
					<div className="logo home">MediaBin</div>
				}

				{ (list && list.length > 0) &&
					<div className="media-list">
						{ list.map(item => {
							return (
								<MediaItem
									key={item.id}
									item={item}
									onClick={() => {
										openRelease(item)
									}}
								/>
							)
						})}
					</div>
				}
			</div>

			<ReleaseModal
				item={currentMedia}
				onClose={closeRelease}
			/>

			{importOpen &&
				<ImportModal
					onClose={closeImport}
					onSuccess={triggerSuccess}
				/>
			}
			<ErrorMessage />
			<Success open={successOpen} />
		</div>
	);
}
