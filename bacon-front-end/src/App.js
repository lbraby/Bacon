import './App.css';
import React from 'react';
import Navbar from "./components/navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";
import Singleplayer from "./pages/singleplayer";
import Multiplayer from "./pages/multiplayer";
import PlayMultiPlayer from './pages/playmultiplayer';

function App() {
	document.body.style = 'background: #E2E3E0';
	return (
		<>
		<Router>
			<Navbar />
			<Routes>
				<Route path="/">
					<Route index element={<Home />} />
					<Route path="/singleplayer" element={<Singleplayer />} />
					<Route path="/multiplayer" index element={<Multiplayer />} />
						<Route path="/multiplayer/play" element={< PlayMultiPlayer/>} />
					<Route/>
				</Route>
			</Routes>
		</Router>
		</>
	);
}

export default App;
