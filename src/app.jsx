import {
	BrowserRouter,
	Routes,
	Route
} from 'react-router-dom';
import { ApplicationProvider } from './contexts/application';
import Header from './components/header';
import Home from './views/home';
import './styles/main.scss';

export default function App() {
	return (
		<ApplicationProvider>
			<BrowserRouter basename="/">
				<Header />
				<div id="container">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/*" element={<Home />} />
					</Routes>
				</div>
			</BrowserRouter>
		</ApplicationProvider>
	)
}
