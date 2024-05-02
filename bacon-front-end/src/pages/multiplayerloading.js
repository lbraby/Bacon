import React, {useEffect, useState }from "react";
import { apiWrapper, sendPulseHost } from "../services/apiServices";
import "./multiplayer.css";
import loading from '../Loading.gif';

const MultiplayerLoading = ({gameId, setScreenCount}) => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		// update count every second
		setTimeout(() => {
			let prevCount = count;
			setCount(prevCount + 1);
			apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/checkready/`)
			.then(data => {
				if (data.ready) {
					setScreenCount(2);
				}
			})
			.catch(err => console.error("error checking status " + err));
			sendPulseHost(gameId)
			.catch(err => console.error("error updating status " + err));
		}, 1000);
	}, [count, gameId, setScreenCount]);
	
	return (
		<div id="main_box">
			<div id="games_scroll">
				<h2>Waiting for opponent to join...</h2>
				<img styles={{width: "80%", margin: "auto"}} src={loading} alt={"loading gif"} />
			</div>
		</div>
	);
};
export default MultiplayerLoading;
