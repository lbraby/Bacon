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
					<Route path="/multiplayer" element={<Multiplayer />} />
				</Route>
			</Routes>
		</Router>
		</>
	);
}

export default App;
