import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import { ApplicationProvider } from './contexts/application';
import Header from './components/header';
import Home from './views/home';
import './styles/main.scss';
import './styles/carousel.scss';

export default function App() {
	return (
		<ApplicationProvider>
			<BrowserRouter basename="/">
				<Header />
				<div id="container">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/collection/:id" element={<Home />} />
						<Route path="/:queryParam" element={<Home />} />
					</Routes>
				</div>
			</BrowserRouter>
		</ApplicationProvider>
	)
}
