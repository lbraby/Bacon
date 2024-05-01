import React, { useState } from "react";
import MultiplayerLoading from "./multiplayerloading";
import MultiplayerStart from "./multiplayerstart";
import MultiplayerPlay from "./multiplayerplay";
import MultiplayerActors from "./multiplayeractors";
import "./multiplayer.css";

const Multiplayer = () => {
	const [screenCount, setScreenCount] = useState(0);
	const [gameId, setGameId] = useState(0);
	const [userType, setUserType] = useState("");
	return(
		<div>
			{(screenCount === 0) &&
				<MultiplayerStart 
					setScreenCount={setScreenCount}
					setGameId={setGameId}
					setUserType={setUserType}
				/>
			}
			{(screenCount === 1) &&
				<MultiplayerLoading 
					gameId={gameId}
					setScreenCount={setScreenCount}
				/>
			}
			{(screenCount === 2) &&
				<MultiplayerActors
					userType={userType}
					setScreenCount={setScreenCount}
					gameId={gameId}
				/>
			}
			{(screenCount === 3) &&
				<MultiplayerPlay userType={userType} gameId={gameId}/>
			}
		</div>
	);
};
export default Multiplayer;
