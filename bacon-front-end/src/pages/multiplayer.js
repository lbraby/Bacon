import React, {useEffect, useState }from "react";
import { useNavigate } from "react-router-dom";
import "./multiplayer.css";

const Multiplayer = () => {
	const [searchVal, setSearchVal] = useState("");
	const [joinableGames, setJoinableGames] = useState([]);
	const [filteredGames, setFilteredGames] = useState([]);
	const [hostName, setHostName] = useState("");
	const navigate = useNavigate();

	const submitHostName = () => {
		return new Promise((resolve, reject) => {
			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userhost_name: hostName.replace(' ', '_')
				})
			};
			fetch(`${process.env.REACT_APP_API_URL}/multiplayer/newgame/`, options)
			.then((resp) => {
				if(!resp.ok) {
					reject(new Error ("404"));
				} else {
					return(resp.json());
				}
			})
			.then(data => 
			{
				if (data.status === "success") {
					navigate("/");
					resolve(1);
				} else {
					resolve(0);
				}
			})
			.catch(() => alert("error submitting username!"))
		})
	};
	

	useEffect(() => {
		// TODO: Change this to something realistic
		fetch(`${process.env.REACT_APP_API_URL}/multiplayer/joinablegames/1000000/`)
			.then((resp) => {
				if(!resp.ok) {
					throw new Error ("404")
				} else {
					return(resp.json());
				}
			})
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
	}, [searchVal]);

	return (
		<div id="main_box">
			<div className="host_container">
				<input type="text" placeholder="Enter Name" onChange={(e) => setHostName(e.target.value)}/>
				<button onClick={() => submitHostName()}>Submit</button>
			</div>
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
									<button>Join!</button>
								</div>
							}
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default Multiplayer;
