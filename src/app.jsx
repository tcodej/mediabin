import { useEffect, useState } from 'react';
import { BrowserRouter,	Routes,	Route } from 'react-router-dom';
import { ApplicationProvider } from './contexts/application';
import Passcode from './components/passcode';
import Header from './components/header';
import Home from './pages/home';
import Admin from './pages/admin';
import './assets/styles/main.scss';
import './assets/styles/carousel.scss';

export default function App() {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		if (!authenticated) {
			if (sessionStorage.getItem('authenticated')) {
				setAuthenticated(true);
			}
		}
	}, [authenticated]);

	const unlock = () => {
		setAuthenticated(true);
	}

	return (
		<ApplicationProvider>
			<BrowserRouter basename="/">
				{authenticated ?
					<>
						<Header />
						<div id="container">
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/admin_csv" element={<Admin />} />
								<Route path="/collection/:id" element={<Home />} />
								<Route path="/:queryParam" element={<Home />} />
							</Routes>
						</div>
					</>
				:
					<Passcode onUnlock={unlock} />
				}
			</BrowserRouter>
		</ApplicationProvider>
	)
}
