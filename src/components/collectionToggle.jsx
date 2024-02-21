export default function CollectionToggle({ collection, onClick }) {
	return (
		<div className="toggle" onClick={onClick}>
			{collection.name}
		</div>
	);
}