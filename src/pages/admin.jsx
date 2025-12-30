import { useEffect, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
import * as api from '../utils/api';
import { delay } from '../utils';

export default function Home() {
	const { readRemoteFile } = usePapaParse();
	const [ data, setData ] = useState(false);
	const [ media, setMedia ] = useState(false);
	const [ list, setList ] = useState(false);

	useEffect(() => {
		readRemoteFile('/import.csv', {
			complete: (response) => {
				setData(response.data);
			}
		});

		api.getMedia().then(response => {
			if (response && response.ok) {
				setMedia(response.result);
			}
		});
	}, []);

	useEffect(() => {
		const items = [];

		if (data && media) {
			data.forEach(row => {
				const newRow = {
					release_id: row[0],
					name: row[1] +' - '+ row[2],
					date_added_csv: row[5],
					notes_csv: row[6]
				};

				const match = media.find(item => item.release_id === row[0]);

				if (match) {
					newRow.id = match.id;
					newRow.date_added = match.date_created;
					newRow.notes = match.notes;
				}

				items.push(newRow);
			});

			console.log(items);
			setList(items);
		}
	}, [data, media]);

	const processItems = async () => {
		// loop through items and reset date_created and notes if needed
		let count = 0;
		for await (const item of list) {
			count++;

			if (item.id && item.date_added_csv !== item.date_added) {
				// update date_created - treated as date_added
				api.updateMediaDate(item.release_id, item.date_added_csv);
				await delay(500);

			} else if (item.id && item.notes_csv && !item.notes) {
				// add notes if empty
				api.updateMediaNotes(item.release_id, item.notes_csv);

			} else {
				console.log('skipping', item);
			}
		}
	};

	return (
		<div id="page-admin">
			<h2>Admin panel</h2>
			<button type="button" className="button" onClick={processItems}>Process</button>
			<table>
				<tbody>
					{list && list.map((item, i) => {
						return (
							<tr key={`${item.release_id}-${i}`}>
								<td>{item.release_id}</td>
								<td>{item.name}</td>
								<td>{item.date_added_csv}</td>
								<td>{item.date_added}</td>
								<td>{item.notes_csv}</td>
								<td>{item.notes}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	);
}
