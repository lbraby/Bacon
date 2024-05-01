import React, {useEffect, useState }from "react";
import { apiWrapper } from "../services/apiServices";
import Modal from "./modal";
import "./multiplayer.css";

const MultiplayerStart = ({setScreenCount, setGameId, setUserType}) => {
	const [searchVal, setSearchVal] = useState("");
	const [joinableGames, setJoinableGames] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [userName, setUserName] = useState("");
	const [showModal, setShowModal] = useState(0);
	const [tempGameId, setTempGameId] = useState(0);

	const openModal = (input) => {
		setTempGameId(input);
		setShowModal(2);
	};

	const submitHostName = () => {
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userhost_name: userName
			})
		};
		apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/newgame/`, options)
		.then(data => {
			setGameId(data.game_id);
			setShowModal(0);
			setUserType("host");
			setScreenCount(1);
		})
		.catch((err) => alert("error submitting username " + err))
	};

	const joinGame = () => {
		const options = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				otheruser_name: userName
			})
		};
		apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/${tempGameId}/joingame/`, options)
		.then(data => {
			setGameId(tempGameId);
			setShowModal(0);
			setUserType("guest");
			setScreenCount(2);
		})
		.catch((err) => alert("error submitting username " + err))
	};
	

	useEffect(() => {
		apiWrapper(`${process.env.REACT_APP_API_URL}/multiplayer/joinablegames/10/`, {})
			.then(data => {
				setJoinableGames(data.data);
				setFilteredGames(data.data);
			})
			.catch(err => {
				console.error(err);
			})
	}, []);

	useEffect(() => {
		if (searchVal === "") {
			setFilteredGames(joinableGames);
		} else {
			const newGames = joinableGames.filter((game) => {
				return(
					game.userhost_name.includes(searchVal)
				)
			});
			const newGamesId = joinableGames.filter((game) => {
				return(
					game.game_id.toString().includes(searchVal)
				)
			});
			setFilteredGames(newGames.concat(newGamesId));
		}
	}, [searchVal, joinableGames]);

	return (
		<div id="main_box">
			{(showModal === 1) &&
				<Modal isOpen={showModal} onClickOutside={() => setShowModal(0)}>
					<h2>Enter a username</h2>
					<div className="host_container">
						<input type="text" placeholder="Enter Name" onChange={(e) => setUserName(e.target.value)}/>
						<button onClick={() => submitHostName()}>Submit</button>
					</div>
				</Modal>
			}
			{(showModal === 2) &&
				<Modal isOpen={showModal} onClickOutside={() => setShowModal(0)}>
					<h2>Enter a username</h2>
					<div className="host_container">
						<input type="text" placeholder="Enter Name" onChange={(e) => setUserName(e.target.value)}/>
						<button onClick={() => joinGame()}>Join!</button>
					</div>
				</Modal>
			}
			<button onClick={() => setShowModal(1)}>
				Host Game
			</button>
			<div>
				<input onChange={(e)=>setSearchVal(e.target.value)} type="text" id="movie_input" placeholder="search by game id or host name..."/>
			</div>
			<div id="games_scroll">
				{filteredGames.map((d, idx) => {
					return (
						<div key={idx}>
							{(Object.keys(d).length !== 0) &&
								<div className="game_box">
									<p>{d.userhost_name}'s game ({d.game_id})</p>
									<button onClick={() => openModal(d.game_id)}>Join!</button>
								</div>
							}
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default MultiplayerStart;
