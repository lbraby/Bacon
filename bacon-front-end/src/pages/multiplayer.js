import React, { useState } from "react";
import MultiplayerLoading from "./multiplayerloading";
import MultiplayerStart from "./multiplayerstart";
import MultiplayerPlay from "./playmultiplayer";
import "./multiplayer.css";

const Multiplayer = () => {
	const [screenCount, setScreenCount] = useState(0);
	const [userType, setUserType] = useState("");
	const [gameId, setGameId] = useState(0);
	return(
		<div>
			{(screenCount === 0) &&
				<MultiplayerStart 
					setScreenCount={setScreenCount}
					setUserType={setUserType}
					setGameId={setGameId}
				/>
			}
			{(screenCount === 1) &&
				<MultiplayerLoading 
					gameId={gameId}
					setScreenCount={setScreenCount}
				/>
			}
			{/* TODO: Change this to add actors */}
			{(screenCount === 2) &&
				<MultiplayerPlay />
			}
		</div>
	);
};
export default Multiplayer;
