import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import { ApplicationProvider } from './contexts/application';
import Header from './components/header';
import Home from './pages/home';
import Admin from './pages/admin';
import './assets/styles/main.scss';
import './assets/styles/carousel.scss';

export default function App() {
	return (
		<ApplicationProvider>
			<BrowserRouter basename="/">
				<Header />
				<div id="container">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/admin_csv" element={<Admin />} />
						<Route path="/collection/:id" element={<Home />} />
						<Route path="/:queryParam" element={<Home />} />
					</Routes>
				</div>
			</BrowserRouter>
		</ApplicationProvider>
	)
}
