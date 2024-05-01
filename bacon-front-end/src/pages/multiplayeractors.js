import React, {useEffect, useState }from "react";
import { apiWrapper, sendPulseGuest, sendPulseHost } from "../services/apiServices";
import Timer from "./timer";
import "./multiplayer.css";

const MultiplayerActors = ({gameId, setScreenCount, userType}) => {
	const [count, setCount] = useState(0);
	const [searchVal, setSearchVal] = useState("");
	const [searchData, setSearchData] = useState([]);
	const [selectedActor, setSelectedActor] = useState({});
	const totalSeconds = 15;
	const delaySeconds = 5;

	const actorSelected = (actor) => {
		setSearchVal("");
		setSelectedActor(actor);
	};

	const submitActor = () => {
		let personId = 0;
		if (Object.keys(selectedActor).length === 0) {
			if (userType === "host") {
				personId = 4724;
				// set default starting actor to Kevin Bacon
			} else {
				personId = 518;
				// set default ending actor to Danny DeVito
			}
		} else {
			personId = selectedActor.person_id;
		}
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		};
		if (userType === "host") {
			apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/selectperson/userhost/${personId}/`, options)
			.catch((err) => alert("error submitting actor " + err))
		}
		else if (userType === "guest") {
			apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${gameId}/selectperson/otheruser/${personId}/`, options)
			.catch((err) => alert("error submitting actor " + err))
		}
	};

	useEffect(() => {
		apiWrapper(`${process.env.REACT_APP_API_URL}/people/search/${searchVal}/10`)
		.then(data => setSearchData(data.data))
		.catch(err => {
			console.error(err);
			setSearchData([]);
		})
	}, [searchVal]);

	useEffect(() => {
		// update count every second
		setTimeout(() => {
			let prevCount = count;
			setCount(prevCount + 1);
			if ((totalSeconds - (prevCount + 1)) === 0 ) {
				submitActor();
			}
			if ((totalSeconds - (prevCount + 1)) === -delaySeconds ) {
				setScreenCount(3);
			}
			// send pulse
			if(userType === "host") {
				sendPulseHost(gameId)
				.catch(err => console.error("error updating status " + err));
			} else {
				sendPulseGuest(gameId)
				.catch(err => console.error("error updating status " + err));
			}
		}, 1000);
	}, [count, gameId, userType]);
	
	return (
		<div id="main_box">
			<h3>Choose an Actor...</h3>
				{(userType === "guest") 
					?
					<div>
						<p>Since you are the guest, you will choose the ending actor</p>
						<p>If you do not select an actor, Kevin Bacon will be chosen by default</p>
					</div>
					:
					<div>
						<p>Since you are the host, you will choose the starting actor</p>
						<p>If you do not select an actor, Kevin Bacon will be chosen by default</p>
					</div>
				}
				<Timer totalSeconds={totalSeconds} newSeconds={count} />
				<div className="host_container">
					{ (Object.keys(selectedActor).length !== 0) &&
						`Selected Actor: ${selectedActor.name}`
					}
					<input style={{marginTop: "5px"}} onChange={(e) => setSearchVal(e.target.value)} placeholder="enter an actor's name"/> 
					{ (searchVal !== "") &&
						<div style={{backgroundColor: '#E2E3E0', zIndex: 1, position: "relative"}}>
							{searchData.map((item, index) => {		
								return(
									<p onClick={() => actorSelected(item)} key={index}>{item.name}</p>
								);
							})}
						</div>
					}
				</div>
		</div>
	);
};
export default MultiplayerActors;
