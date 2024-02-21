export default function FilterToggle({ filter, onClick, isActive }) {
	return (
		<div className={'toggle'+ (isActive ? ' is-active' : '')} onClick={onClick}>
			{isActive ? '+ ' : ''}{filter.label}
		</div>
	);
}