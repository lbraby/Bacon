import './App.css';
import React from 'react';
import Navbar from "./components/navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages";

function App() {
	return (
		<>
		<Router>
			<Navbar />
			<Routes>
				<Route path="/">
					<Route index element={<Home />} />
				</Route>
			</Routes>
		</Router>
		</>
	);
}

export default App;
