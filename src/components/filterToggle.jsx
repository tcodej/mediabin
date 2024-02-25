import { Fragment } from 'react'

export default ({ filter, onClick, isActive }) => {
	return (
		<Fragment>
			{ filter &&
				<div className={'toggle'+ (isActive ? ' is-active' : '')} onClick={onClick}>
					{filter.label}
				</div>
			}
		</Fragment>
	);
}