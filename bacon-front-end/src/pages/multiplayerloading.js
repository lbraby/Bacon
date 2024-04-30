import React, {useEffect, useState }from "react";
import { useLocation } from "react-router-dom";
import "./multiplayer.css";

const MultiplayerLoading = ({game_id, setScreenCount}) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		// update count every second
		setTimeout(() => {
			let prevCount = count;
			setCount(prevCount + 1);
			new Promise((resolve, reject) => {

			});
		}, 1000);
	}, [count]);
	return (
		<div id="main_box">
			<div id="games_scroll">
				<h2>Loading...</h2>
				<p>{count}</p>
			</div>
		</div>
	);
};
export default MultiplayerLoading;
