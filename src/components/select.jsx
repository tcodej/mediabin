import { Fragment, useState, useEffect, useRef } from 'react';
import { useClickOutside } from 'use-events';

export default function Select({ placeholder, options, onSelect, search, reset, ...props }) {
	if (!placeholder) {
		placeholder = 'Select...';
	}

	const defaultValue = { label: placeholder, value: '' };
	const elt = useRef();
	const searchField = useRef();
	const [ isOpen, setIsOpen ] = useState(false);
	const [ selected, setSelected ] = useState(defaultValue);
	const [ list, setList ] = useState(options);
	const [ searchVal, setSearchVal ] = useState('');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const onKeyUp = (e) => {
				if (e.key === 'Escape') {
					toggleDropdown(false);
				}
			}

			if (isOpen) {
				window.addEventListener('keyup', onKeyUp);
				if (search) {
					searchField.current.focus();
				}
			}

			return () => {
				window.removeEventListener('keyup', onKeyUp);
			};
		}
	}, [isOpen]);

	// auto-select if option has selected: true
	useEffect(() => {
		if (options) {
			options.forEach(option => {
				if (option.selected) {
					optionSelect(option);
				}
			})
		}
	}, []);

	useEffect(() => {
		if (reset === true) {
			setSelected(defaultValue);
		}
	}, [reset]);

	useClickOutside([elt], () => toggleDropdown(false));

	const toggleDropdown = (force) => {
		if (typeof force === 'boolean') {
			setIsOpen(force);

		} else {
			setIsOpen(!isOpen);
		}
	}

	const optionSelect = (option) => {
		setSelected(option);

		if (typeof onSelect === 'function') {
			onSelect(option);
		}

		toggleDropdown(false);
	}

	const searchFilter = () => {
		const q = searchField.current.value.trimStart();
		setSearchVal(q);

		const results = options.filter(item => {
			if (item.label.toLowerCase().indexOf(q.trim().toLowerCase()) > -1) {
				return item;
			}
		});

		setList(results);
	}

	return (
		<div className={'dropdown'+ (isOpen ? ' is-active' : '')} ref={elt} {...props}>
			<div className="dropdown-trigger" onClick={toggleDropdown}>{selected.label}</div>
			{ (isOpen && options) &&
				<div className="dropdown-list">
					{search &&
						<input
							ref={searchField}
							className="select-search"
							type="text"
							placeholder="Search..."
							value={searchVal}
							onChange={searchFilter}
						/>
					}
					<ul>
					{list.length ?
						<Fragment>
							{list.map(option => {
								return (
									<li
										key={option.value}
										title={option.label} 
										onClick={() => optionSelect(option)}
										className={selected.value === option.value ? 'is-active' : ''}
									>
										{option.label}
									</li>
								)
							})}
						</Fragment>
					:
						<li>No results</li>
					}
					</ul>
				</div>
			}
		</div>
	);
}