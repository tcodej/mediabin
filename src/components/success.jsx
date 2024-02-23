import { Fragment } from 'react';

export default function Success({ open }) {
	return (
		<Fragment>
			{ open &&
				<div id="success">
					<div className="icon" />
				</div>
			}
		</Fragment>
	);
}