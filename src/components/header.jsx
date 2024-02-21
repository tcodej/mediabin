import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/application';

export default function Header() {
	const { appState, appAction } = useAppContext();
	const menuOpen = useRef(false);

	const handleKeyUp = useCallback(e => {
		// using appState.menuOpen doesn't work because of scope
		menuOpen.current = !menuOpen.current;

		// esc toggles sidebar search
		if (e.keyCode === 27) {
			appAction.toggleMenu(menuOpen.current);
		}
	}, [appAction]);

	useEffect(() => {
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyUp]);

	const toggleMenu = () => {
		appAction.toggleMenu();
	}

	return (
		<header>
			<div className={'btn-menu'+ (appState.menuOpen ? ' is-active' : '')} onClick={toggleMenu}>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<h1 className="logo"><Link to="/">Media<span>Bin</span></Link></h1>
		</header>
	);
}
